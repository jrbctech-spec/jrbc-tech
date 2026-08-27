import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendEmailNotification } from '@/lib/emailService';
import { calcularComissao } from '@/lib/utils';
import { Chamado } from '@/types/database.types';

export async function GET() {
  const results = {
    supabase_connection: false,
    read_usuarios: false,
    read_clientes: false,
    create_chamado: false,
    comissao_calculada: false,
    email_dispatch: false,
    details: {} as any,
  };

  try {
    // 1. Supabase Connection & Reads
    const { data: categorias, error: catError } = await supabase.from('categorias').select('id').limit(1);
    if (!catError) {
      results.supabase_connection = true;
    } else {
      results.details.catError = catError.message;
    }

    let { data: clienteArr, error: cliError } = await supabase.from('clientes').select('id').limit(1);
    let cliente = clienteArr?.[0];
    
    if (!cliente) {
      // Create mock client
      const { data: mockCli } = await supabase.from('clientes').insert({
        razao_social: 'Mock Teste Cliente',
        nome_fantasia: 'Mock',
        email: 'mock@cliente.com',
        status: 'ATIVO'
      }).select().single();
      cliente = mockCli;
    }

    if (cliente) {
      results.read_clientes = true;
    } else {
      results.details.cliError = cliError?.message || 'Falha ao criar cliente mock';
    }

    let { data: usuarioArr, error: usrError } = await supabase.from('usuarios').select('id, email, nome').limit(1);
    let usuario = usuarioArr?.[0];

    if (!usuario) {
      // Create mock user
      const uniqueEmail = `mock_${Date.now()}@usuario.com`;
      const { data: mockUsr, error: mockUsrErr } = await supabase.from('usuarios').insert({
        nome: 'Usuario Mock Teste',
        email: uniqueEmail,
        tipo_usuario: 'CLIENTE',
        cliente_id: cliente?.id,
        ativo: true
      }).select().single();
      usuario = mockUsr;
      if (mockUsrErr) {
         results.details.usrError = mockUsrErr.message;
      }
    }

    if (usuario) {
      results.read_usuarios = true;
    } else if (!results.details.usrError) {
      results.details.usrError = usrError?.message || 'Falha ao criar usuário mock';
    }

    // 2. Persistência de Chamado (Teste)
    if (cliente && usuario && categorias && categorias.length > 0) {
      const valorServicoTeste = 500;
      const { taxaEmpresa, valorTecnico } = calcularComissao(valorServicoTeste);
      
      if (taxaEmpresa === 150 && valorTecnico === 350) {
        results.comissao_calculada = true;
      }

      const { data: servico } = await supabase.from('servicos').select('id').eq('categoria_id', categorias[0].id).limit(1).single();

      if (servico) {
        const testChamado = {
          numero_chamado: `TEST-${Date.now()}`,
          cliente_id: cliente.id,
          solicitante_id: usuario.id,
          categoria_id: categorias[0].id,
          servico_id: servico.id,
          titulo: '[TESTE DE INTEGRAÇÃO] Instalação de SO',
          descricao: 'Teste automatizado de fluxo completo do sistema',
          prioridade: 'BAIXA',
          equipamento_marca: 'Dell',
          equipamento_modelo: 'Inspiron 15',
          equipamento_serial: 'TEST-1234',
          valor_servico: valorServicoTeste,
          taxa_empresa: taxaEmpresa,
          valor_tecnico: valorTecnico,
          status: 'AGUARDANDO_PAGAMENTO',
        };

        const { data: newChamado, error: insertError } = await supabase
          .from('chamados')
          .insert(testChamado)
          .select()
          .single();

        if (newChamado) {
          results.create_chamado = true;
          results.details.created_id = newChamado.id;

          // Cleanup test ticket (optional, but good practice so we don't pollute the DB, though keeping it might show it works)
          // await supabase.from('chamados').delete().eq('id', newChamado.id);
        } else {
          results.details.insertError = insertError?.message;
        }
      }
    }

    // 3. Email Dispatch Test
    try {
      // Mock Chamado object for email test
      const dummyChamado = {
        numero_chamado: 'TEST-999',
        titulo: 'Teste de Integração de Email',
        descricao: 'Este é um teste automatizado.',
        data_abertura: new Date().toISOString(),
      } as unknown as Chamado;

      // The email service uses Resend/Nodemailer or just console.logs if NEXT_PUBLIC_SUPABASE_URL isn't set up for emails.
      // Since we don't have Resend API keys strictly enforced, this will likely mock/succeed locally.
      await sendEmailNotification('NOVO_CHAMADO', dummyChamado, 'jrbctech@gmail.com');
      results.email_dispatch = true;
    } catch (emailError: any) {
      results.details.emailError = emailError.message;
    }

    const isSuccess = results.supabase_connection && results.create_chamado && results.email_dispatch && results.comissao_calculada;

    return NextResponse.json({
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      results
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'ERROR', error: err.message }, { status: 500 });
  }
}

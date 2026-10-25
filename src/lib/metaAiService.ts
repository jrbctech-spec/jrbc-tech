export async function pedirDiagnosticoMetaAI(prompt: string, context?: string): Promise<string> {
  try {
    const response = await fetch('/api/meta-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      throw new Error('Falha na resposta do assistente Meta AI.');
    }

    const data = await response.json();
    return data.resposta || 'Não foi possível gerar um diagnóstico automático.';
  } catch (error) {
    console.error('Erro ao consultar Meta AI:', error);
    return 'Assistente temporariamente indisponível. Por favor, acione a equipe técnica da JRBC TECH.';
  }
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Usuario, UserRole } from '@/types/database.types';
import { MOCK_USUARIOS } from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

interface AuthContextType {
  user: Usuario | null;
  role: UserRole;
  isLoading: boolean;
  isSupabaseActive: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithEmail: (nome: string, email: string, pass: string, empresa?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  setUserManually: (usuario: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [role, setRole] = useState<UserRole>('CLIENTE');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);

  // Helper para determinar o papel do usuário a partir do e-mail ou dados da tabela
  const resolveUserRole = (email: string, dbRole?: UserRole): UserRole => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'jrbctech@gmail.com' || cleanEmail === 'admin@jrbtc.com.br' || cleanEmail.includes('admin')) {
      return 'ADMIN';
    }
    if (cleanEmail.includes('tecnico') || cleanEmail === 'carlos.silva@jrbtc.com.br' || cleanEmail === 'mariana.oliveira@jrbtc.com.br') {
      return 'TECNICO';
    }
    return dbRole || 'CLIENTE';
  };

  useEffect(() => {
    const hasSupabase = isSupabaseConfigured();
    setIsSupabaseActive(hasSupabase);

    const initAuth = async () => {
      try {
        if (hasSupabase) {
          // Obter sessão atual do Supabase Auth
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user?.email) {
            const userEmail = session.user.email;
            // Buscar perfil na tabela usuarios
            const { data: dbUser } = await supabase
              .from('usuarios')
              .select('*, cliente:clientes(*)')
              .eq('email', userEmail)
              .maybeSingle();

            if (dbUser) {
              const determinedRole = resolveUserRole(userEmail, dbUser.tipo_usuario);
              setUser({ ...dbUser, tipo_usuario: determinedRole });
              setRole(determinedRole);
            } else {
              // Usuário autenticado no Supabase Auth mas ainda sem registro na tabela usuarios
              const determinedRole = resolveUserRole(userEmail);
              const newUserObj: Usuario = {
                id: session.user.id,
                auth_id: session.user.id,
                nome: session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0],
                email: userEmail,
                tipo_usuario: determinedRole,
                ativo: true,
              };

              // Tentar salvar na tabela usuarios
              await supabase.from('usuarios').upsert({
                id: session.user.id,
                auth_id: session.user.id,
                nome: newUserObj.nome,
                email: userEmail,
                tipo_usuario: determinedRole,
                ativo: true,
              });

              setUser(newUserObj);
              setRole(determinedRole);
            }
          } else {
            // Verificar se há usuário salvo localmente (para demo ou persistência)
            const savedUserJson = localStorage.getItem('jrbtc_authenticated_user');
            if (savedUserJson) {
              const parsed = JSON.parse(savedUserJson) as Usuario;
              setUser(parsed);
              setRole(parsed.tipo_usuario);
            } else {
              // Padrão: Usuário Cliente Demo
              const defaultClient = MOCK_USUARIOS[3]; // Roberto Mendes (Cliente)
              setUser(defaultClient);
              setRole('CLIENTE');
            }
          }
        } else {
          // Sem Supabase configurado, usar usuário persistido ou padrão
          const savedUserJson = localStorage.getItem('jrbtc_authenticated_user');
          if (savedUserJson) {
            const parsed = JSON.parse(savedUserJson) as Usuario;
            setUser(parsed);
            setRole(parsed.tipo_usuario);
          } else {
            setUser(MOCK_USUARIOS[3]); // Roberto Mendes (Cliente)
            setRole('CLIENTE');
          }
        }
      } catch (err) {
        console.error('[JRBTC-TECH] Erro na inicialização da autenticação:', err);
        setUser(MOCK_USUARIOS[3]);
        setRole('CLIENTE');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Escutar mudanças de autenticação no Supabase se ativo
    if (hasSupabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user?.email) {
          const userEmail = session.user.email;
          const { data: dbUser } = await supabase
            .from('usuarios')
            .select('*, cliente:clientes(*)')
            .eq('email', userEmail)
            .maybeSingle();

          const determinedRole = resolveUserRole(userEmail, dbUser?.tipo_usuario);
          const userData: Usuario = dbUser || {
            id: session.user.id,
            auth_id: session.user.id,
            nome: session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0],
            email: userEmail,
            tipo_usuario: determinedRole,
            ativo: true,
          };

          setUser(userData);
          setRole(determinedRole);
          localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(userData));
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('jrbtc_authenticated_user');
          setUser(null);
          setRole('CLIENTE');
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, []);

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } else {
      // Fallback de demonstração
      const adminUser = MOCK_USUARIOS[0];
      setUser(adminUser);
      setRole('ADMIN');
      localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(adminUser));
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<{ error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        // Se a conta não existir no Supabase Auth, permitir login com contas de demonstração conhecidas
        const matchedMock = MOCK_USUARIOS.find(u => u.email.toLowerCase() === cleanEmail);
        if (matchedMock) {
          setUser(matchedMock);
          setRole(matchedMock.tipo_usuario);
          localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(matchedMock));
          return {};
        }
        return { error: error.message };
      }

      if (data.user) {
        const determinedRole = resolveUserRole(cleanEmail);
        const { data: dbUser } = await supabase
          .from('usuarios')
          .select('*, cliente:clientes(*)')
          .eq('email', cleanEmail)
          .maybeSingle();

        const userObj: Usuario = dbUser || {
          id: data.user.id,
          nome: cleanEmail.split('@')[0],
          email: cleanEmail,
          tipo_usuario: determinedRole,
          ativo: true,
        };

        setUser(userObj);
        setRole(determinedRole);
        localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(userObj));
        return {};
      }
    }

    // Modo Mock / Fallback
    const found = MOCK_USUARIOS.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setUser(found);
      setRole(found.tipo_usuario);
      localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(found));
      return {};
    }

    // Criar novo usuário cliente em memória
    const determinedRole = resolveUserRole(cleanEmail);
    const newUser: Usuario = {
      id: 'user-' + Date.now(),
      nome: cleanEmail.split('@')[0],
      email: cleanEmail,
      tipo_usuario: determinedRole,
      cliente_id: '33333333-3333-3333-3333-333333333301',
      ativo: true,
    };

    setUser(newUser);
    setRole(determinedRole);
    localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(newUser));
    return {};
  };

  const signUpWithEmail = async (nome: string, email: string, pass: string, empresa?: string): Promise<{ error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: nome,
            empresa: empresa || 'Empresa Cliente',
          },
        },
      });

      if (error) return { error: error.message };

      if (data.user) {
        // Criar empresa cliente se informada
        let createdClienteId = '33333333-3333-3333-3333-333333333301';
        if (empresa) {
          const { data: newCli } = await supabase
            .from('clientes')
            .insert({
              razao_social: empresa,
              nome_fantasia: empresa,
              email: cleanEmail,
              status: 'ATIVO',
            })
            .select()
            .single();

          if (newCli) createdClienteId = newCli.id;
        }

        // Criar usuário na tabela
        await supabase.from('usuarios').upsert({
          id: data.user.id,
          auth_id: data.user.id,
          nome,
          email: cleanEmail,
          tipo_usuario: 'CLIENTE',
          cliente_id: createdClienteId,
          ativo: true,
        });

        const userObj: Usuario = {
          id: data.user.id,
          nome,
          email: cleanEmail,
          tipo_usuario: 'CLIENTE',
          cliente_id: createdClienteId,
          ativo: true,
        };

        setUser(userObj);
        setRole('CLIENTE');
        localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(userObj));
        return {};
      }
    }

    // Modo Mock
    const userObj: Usuario = {
      id: 'usr-' + Date.now(),
      nome,
      email: cleanEmail,
      tipo_usuario: 'CLIENTE',
      cliente_id: '33333333-3333-3333-3333-333333333301',
      ativo: true,
    };
    setUser(userObj);
    setRole('CLIENTE');
    localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(userObj));
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Erro ao deslogar do Supabase:', err);
      }
    }
    localStorage.removeItem('jrbtc_authenticated_user');
    setUser(null);
    setRole('CLIENTE');
  };

  const setUserManually = (usuario: Usuario) => {
    setUser(usuario);
    setRole(usuario.tipo_usuario);
    localStorage.setItem('jrbtc_authenticated_user', JSON.stringify(usuario));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isSupabaseActive,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        setUserManually,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

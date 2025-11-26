import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schemas
export const signUpSchema = z.object({
  email: z.string().trim().email({ message: "유효한 이메일 주소를 입력하세요" }).max(255),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다" }).max(100),
  fullName: z.string().trim().min(1, { message: "이름을 입력하세요" }).max(100),
});

export const signInSchema = z.object({
  email: z.string().trim().email({ message: "유효한 이메일 주소를 입력하세요" }),
  password: z.string().min(1, { message: "비밀번호를 입력하세요" }),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;

export const signUp = async (data: SignUpData) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: data.fullName,
      },
    },
  });
  
  return { error };
};

export const signIn = async (data: SignInData) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  
  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

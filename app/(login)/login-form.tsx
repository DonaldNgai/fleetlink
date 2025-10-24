'use client';

import { useActionState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

const getFormSchema = (mode: 'signin' | 'signup') => {
  const baseSchema = {
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  };

  if (mode === 'signin') {
    return z.object({
      ...baseSchema,
      remember: z.boolean().optional(),
    });
  }

  return z
    .object({
      ...baseSchema,
      confirmPassword: z
        .string()
        .min(6, { message: 'Confirm Password must be at least 6 characters.' }),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    });
};

type SignInFormData = z.infer<ReturnType<typeof getFormSchema>> & { remember?: boolean };
type SignUpFormData = z.infer<ReturnType<typeof getFormSchema>> & { confirmPassword: string };

export function AuthForm({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  const formSchema = getFormSchema(mode);
  const form = useForm<SignInFormData | SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === 'signin'
        ? { email: '', password: '', remember: false }
        : { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SignInFormData | SignUpFormData) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('redirect', redirect || '');
      formData.append('priceId', priceId || '');
      formData.append('inviteId', inviteId || '');

      if (mode === 'signin' && 'remember' in data) {
        formData.append('remember', String(data.remember || false));
      }

      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  defaultValue={state.email}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  defaultValue={state.password}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'signup' && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {mode === 'signin' && (
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center">
                <FormControl>
                  <Checkbox
                    id="login-remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="size-4"
                  />
                </FormControl>
                <FormLabel
                  htmlFor="login-remember"
                  className="text-muted-foreground ml-1 text-sm font-medium"
                >
                  Remember me for 30 days
                </FormLabel>
              </FormItem>
            )}
          />
        )}

        {state?.error && <div className="text-red-500 text-sm">{state.error}</div>}

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Loading...
            </>
          ) : mode === 'signin' ? (
            'Sign in'
          ) : (
            'Sign up'
          )}
        </Button>
      </form>
    </Form>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuth = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        toast({ 
          title: "Login Successful", 
          description: "Welcome back to LifeBoard!" 
        });
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: email.split('@')[0] // default username from email
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user?.identities?.length === 0) {
          toast({ 
            title: "Account Already Exists", 
            description: "This email is already registered. Please log in instead.", 
            variant: "destructive" 
          });
          setIsLogin(true);
        } else {
          toast({ 
            title: "Account Created", 
            description: "Your LifeBoard account is ready!" 
          });
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({ 
        title: "Authentication Error", 
        description: error.message || "An error occurred during authentication", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">{isLogin ? 'Login' : 'Sign Up'} to LifeBoard</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
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
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
              </Button>
              <div className="text-center">
                <Button 
                  type="button"
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={isLoading}
                >
                  {isLogin 
                    ? 'Need an account? Sign Up' 
                    : 'Already have an account? Login'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

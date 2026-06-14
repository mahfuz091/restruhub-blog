"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { registerUser } from "@/app/actions/user/user.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function RegisterForm({ className, ...props }) {
  const router = useRouter();

  const initialState = { success: false, msg: "" };

  const [state, fromAction, isLoading] = useActionState(
    registerUser,
    initialState
  );

  useEffect(() => {
    if (!state.msg) return;

    if (state.success) {
      toast.success("Account created successfully!");

      router.push("/dashboard");
    } else {
      toast.error(state.msg || "Something went wrong!");
    }
  }, [state, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Create an account</CardTitle>
          {/* <CardDescription>
            Sign up with your email or continue with Apple/Google
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form action={fromAction}>
            <div className='grid gap-6'>
              <div className='hidden flex-col gap-4'>
                <Button variant='outline' className='w-full'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='mr-2 h-5 w-5'
                  >
                    <path
                      d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                      fill='currentColor'
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>

              {/* <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-card text-muted-foreground relative z-10 px-2'>
                  Or continue with
                </span>
              </div> */}

              <div className='grid gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    type='text'
                    name='name'
                    placeholder='your name'
                    required
                  />
                </div>

                <div className='grid gap-3'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    name='email'
                    placeholder='m@example.com'
                    required
                  />
                </div>

                <div className='grid gap-3'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    required
                  />
                </div>

                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <Loader2 className='h-5 w-5 animate-spin' />
                      Signing...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>

              <div className='text-center text-sm'>
                Already have an account?{" "}
                <Link href='/' className='underline underline-offset-4'>
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className='text-muted-foreground text-center text-xs'>
        By signing up, you agree to our{" "}
        <a href='#' className='underline'>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href='#' className='underline'>
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

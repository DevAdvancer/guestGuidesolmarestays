"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { verifyPin } from "@/actions/verify-pin"
import { Loader2 } from "lucide-react"

export default function PinEntryPage() {
  const [isPending, startTransition] = useTransition()
  const [isNavigating, setIsNavigating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Combined loading state
  const isLoading = isPending || isNavigating

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const pin = formData.get("pin") as string

    if (!pin) {
      setError("Please enter a PIN.")
      return
    }

    startTransition(async () => {
      try {
        // Add minimum loading time for better UX feedback
        const [result] = await Promise.all([
          verifyPin(formData),
          new Promise(resolve => setTimeout(resolve, 800))
        ])

        if (result?.success && result.slug) {
          setIsNavigating(true)
          router.push(`/guide/${result.slug}`)
          return
        }

        if (result?.error) {
          setError(result.error)
        }
      } catch (err) {
        setError("Something went wrong. Please try again.")
      }
    })
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
            <Image
              src="/logo.png"
              alt="Solmaré Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome to Solmaré
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your access PIN to view your guest guide
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Guest Access</CardTitle>
            <CardDescription>
              Please enter the 4-digit PIN provided in your check-in instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  name="pin"
                  placeholder="Enter PIN (e.g. 1234)"
                  required
                  className="text-center text-lg tracking-widest"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive text-center font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying PIN...
                  </>
                ) : (
                  "View Guidebook"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground pt-8">
          Need help? <a href="tel:+18052426411" className="underline hover:text-primary">Contact Management</a>
        </p>
      </div>
    </main>
  )
}

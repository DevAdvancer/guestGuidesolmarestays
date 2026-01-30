"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { verifyPin } from "@/actions/verify-pin"
import { Loader } from "@/components/ui/loader"

export default function PinEntryPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await verifyPin(formData)
      if (result?.success && result.slug) {
        router.push(`/guidebook/${result.slug}`)
        // Keep loading state true while navigating
        return
      }

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch (e) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
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
            <form action={handleSubmit} className="space-y-4">
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
                    <Loader size="sm" className="mr-2" />
                    Verifying...
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

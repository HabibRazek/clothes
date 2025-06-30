'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
// import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
  Shield,
  ShieldCheck,
  ShieldX,
  QrCode,
  Copy,
  Download,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Key,
  Smartphone
} from 'lucide-react'
import {
  setupTwoFactorAction,
  verifyAndEnableTwoFactorAction,
  disableTwoFactorAction,
  regenerateBackupCodesAction
} from '@/lib/actions/2fa'

interface TwoFactorAuthProps {
  user: {
    id: string
    email: string
    twoFactorEnabled?: boolean
  }
}

export default function TwoFactorAuth({ user }: TwoFactorAuthProps) {
  const [isPending, startTransition] = useTransition()
  const [setupData, setSetupData] = useState<{
    qrCodeUrl: string
    backupCodes: string[]
    manualEntryKey: string
  } | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [currentStep, setCurrentStep] = useState<'setup' | 'verify' | 'complete'>('setup')

  const handleSetup2FA = () => {
    startTransition(async () => {
      try {
        const result = await setupTwoFactorAction()

        if (result.success && result.data) {
          setSetupData(result.data)
          setCurrentStep('verify')
          setShowSetupDialog(true)
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to setup 2FA')
        console.error('2FA setup error:', error)
      }
    })
  }

  const handleVerify2FA = () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter a verification code')
      return
    }

    startTransition(async () => {
      try {
        const result = await verifyAndEnableTwoFactorAction(verificationCode)

        if (result.success) {
          setCurrentStep('complete')
          toast.success(result.message)
          // Close dialog after a delay
          setTimeout(() => {
            setShowSetupDialog(false)
            setCurrentStep('setup')
            setVerificationCode('')
            setSetupData(null)
          }, 2000)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to verify 2FA')
        console.error('2FA verification error:', error)
      }
    })
  }

  const handleDisable2FA = () => {
    if (!disablePassword.trim()) {
      toast.error('Please enter your password')
      return
    }

    startTransition(async () => {
      try {
        const result = await disableTwoFactorAction(disablePassword)

        if (result.success) {
          setShowDisableDialog(false)
          setDisablePassword('')
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to disable 2FA')
        console.error('2FA disable error:', error)
      }
    })
  }

  const handleRegenerateBackupCodes = () => {
    startTransition(async () => {
      try {
        const result = await regenerateBackupCodesAction()

        if (result.success && result.data) {
          setSetupData(prev => prev ? {
            ...prev,
            backupCodes: result.data!.backupCodes
          } : null)
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        toast.error('Failed to regenerate backup codes')
        console.error('Backup codes regeneration error:', error)
      }
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const downloadBackupCodes = (codes: string[]) => {
    const content = `Two-Factor Authentication Backup Codes\n\nAccount: ${user.email}\nGenerated: ${new Date().toLocaleString()}\n\n${codes.join('\n')}\n\nKeep these codes safe and secure. Each code can only be used once.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `2fa-backup-codes-${user.email}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Backup codes downloaded')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Secure your account with Google Authenticator or similar TOTP apps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border rounded-lg bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-start sm:items-center gap-3 mb-4 sm:mb-0">
            {user.twoFactorEnabled ? (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 ring-2 ring-green-200">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 ring-2 ring-red-200">
                <ShieldX className="h-6 w-6 text-red-600" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">
                  {user.twoFactorEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled'}
                </h3>
                <Badge
                  variant={user.twoFactorEnabled ? 'default' : 'secondary'}
                  className={user.twoFactorEnabled ? 'bg-green-100 text-green-700 border-green-200' : ''}
                >
                  {user.twoFactorEnabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {user.twoFactorEnabled
                  ? 'Your account is protected with an additional security layer using Google Authenticator or compatible apps.'
                  : 'Secure your account with an extra layer of protection. We recommend enabling 2FA for enhanced security.'
                }
              </p>
              {user.twoFactorEnabled && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Protected</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {user.twoFactorEnabled ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateBackupCodes}
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Regenerate Codes</span>
                  <span className="sm:hidden">Regenerate</span>
                </Button>
                <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50">
                      <ShieldX className="mr-2 h-4 w-4" />
                      Disable
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Disable Two-Factor Authentication
                      </DialogTitle>
                      <DialogDescription>
                        This will remove the extra security layer from your account. Enter your password to confirm.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="disable-password">Password</Label>
                        <Input
                          id="disable-password"
                          type="password"
                          value={disablePassword}
                          onChange={(e) => setDisablePassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowDisableDialog(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDisable2FA}
                          disabled={isPending}
                          className="w-full sm:w-auto"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Disabling...
                            </>
                          ) : (
                            'Disable 2FA'
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Button
                onClick={handleSetup2FA}
                disabled={isPending}
                className="w-full sm:w-auto bg-[#09B1BA] hover:bg-[#078A91]"
                size="sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Enable 2FA
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Backup Codes Management (only if 2FA is enabled) */}
        {user.twoFactorEnabled && (
          <div className="space-y-4">
            <Separator />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <Key className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Backup Codes</h3>
                  <p className="text-sm text-gray-600">
                    Emergency access codes for when you lose your authenticator device
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateBackupCodes}
                disabled={isPending}
                className="w-full sm:w-auto bg-white hover:bg-gray-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Regenerate Codes</span>
                    <span className="sm:hidden">Regenerate</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Setup Dialog */}
        <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
          <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#09B1BA]/10">
                {currentStep === 'setup' && <QrCode className="h-6 w-6 text-[#09B1BA]" />}
                {currentStep === 'verify' && <Shield className="h-6 w-6 text-[#09B1BA]" />}
                {currentStep === 'complete' && <CheckCircle className="h-6 w-6 text-green-600" />}
              </div>
              <DialogTitle className="text-xl sm:text-2xl">
                {currentStep === 'setup' && 'Setup Two-Factor Authentication'}
                {currentStep === 'verify' && 'Verify Your Setup'}
                {currentStep === 'complete' && 'Setup Complete!'}
              </DialogTitle>
              <DialogDescription className="text-center">
                {currentStep === 'setup' && 'Scan the QR code with your authenticator app'}
                {currentStep === 'verify' && 'Enter the 6-digit code from your authenticator app'}
                {currentStep === 'complete' && 'Two-factor authentication is now enabled'}
              </DialogDescription>
            </DialogHeader>

            {currentStep === 'verify' && setupData && (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                      <img
                        src={setupData.qrCodeUrl}
                        alt="2FA QR Code"
                        className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Smartphone className="h-4 w-4" />
                      <span>Scan with Google Authenticator or similar app</span>
                    </div>

                    {/* Manual Entry */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs text-gray-500 px-2">OR</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 font-medium">
                          Enter this code manually:
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <code className="flex-1 p-3 bg-gray-50 border rounded-lg text-xs sm:text-sm font-mono break-all text-center sm:text-left">
                            {setupData.manualEntryKey}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(setupData.manualEntryKey)}
                            className="w-full sm:w-auto"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-center block">Verification Code</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={verificationCode}
                        onChange={(value) => setVerificationCode(value)}
                        autoFocus
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                        </InputOTPGroup>
                        <div className="flex items-center justify-center w-4">
                          <div className="w-2 h-0.5 bg-gray-300 rounded-full"></div>
                        </div>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                          <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  <Button
                    onClick={handleVerify2FA}
                    disabled={isPending || verificationCode.length !== 6}
                    className="w-full bg-[#09B1BA] hover:bg-[#078A91]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Enable'
                    )}
                  </Button>
                </div>

                {/* Backup Codes */}
                <div className="space-y-4">
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-lg">Backup Codes</h4>
                        <p className="text-sm text-gray-600">Emergency access codes for your account</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadBackupCodes(setupData.backupCodes)}
                        className="w-full sm:w-auto"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Codes
                      </Button>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Key className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-amber-900">
                            Important: Save these codes safely
                          </p>
                          <ul className="text-xs text-amber-800 space-y-1">
                            <li>• Each code can only be used once</li>
                            <li>• Store them in a secure location</li>
                            <li>• Use them if you lose access to your authenticator</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {setupData.backupCodes.map((code, index) => (
                        <div key={index} className="p-3 bg-gray-50 border rounded-lg text-center">
                          <code className="text-sm font-mono font-medium">{code}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'complete' && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 ring-4 ring-green-50">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-green-900">Two-Factor Authentication Enabled!</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                    Your account is now protected with an additional layer of security. You'll need your authenticator app to sign in.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Account Security Enhanced</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Mail, Building2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e, mode = 'local') => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, mode);
      
      // Redirigir según el rol
      if (result.user.role === 'field_technician') {
        navigate('/FieldTechApp');
      } else {
        navigate('/Dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAzureLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await login('', '', 'azure');
      
      // Redirigir según el rol
      if (result.user.role === 'field_technician') {
        navigate('/FieldTechApp');
      } else {
        navigate('/Dashboard');
      }
    } catch (err) {
      setError(err.message || 'Azure login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68caae368af6d6c0361ce882/9d05683e4_CTI-Logo-300x70.jpg" 
            alt="CTI Labs" 
            className="h-12 mx-auto mb-4"
          />
          <CardTitle className="text-2xl">ProLab System</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="staff" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="staff">Staff Login</TabsTrigger>
              <TabsTrigger value="client">Client Login</TabsTrigger>
            </TabsList>

            {/* Staff Login */}
            <TabsContent value="staff" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@cti.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#64748B]">Or</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleAzureLogin}
                disabled={loading}
              >
                <Building2 className="w-4 h-4" />
                Sign in with Azure AD
              </Button>

              <div className="text-center text-sm text-[#64748B]">
                <p className="mb-2">Demo Credentials:</p>
                <p><strong>Admin:</strong> admin@cti.com / admin123</p>
                <p><strong>Tech:</strong> tech@cti.com / tech123</p>
              </div>
            </TabsContent>

            {/* Client Login */}
            <TabsContent value="client" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="client@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      id="client-password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#10B981] hover:bg-[#059669]"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Client Sign In'}
                </Button>
              </form>

              <div className="text-center text-sm text-[#64748B]">
                <p className="mb-2">Demo Client:</p>
                <p>client@example.com / client123</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
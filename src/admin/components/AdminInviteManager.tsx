import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Copy, 
  Trash2, 
  Mail, 
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface AdminInvite {
  id: string;
  email: string;
  role: 'admin' | 'moderator';
  inviteCode: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
  invitedBy: string;
}

export const AdminInviteManager: React.FC = () => {
  const { logAdminAction } = useAdmin();
  const [invites, setInvites] = useState<AdminInvite[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      role: 'moderator',
      inviteCode: 'MOD-2024-001',
      status: 'pending',
      createdAt: '2024-01-20T10:00:00Z',
      expiresAt: '2024-01-27T10:00:00Z',
      invitedBy: 'admin@swingboudoir.com'
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      role: 'admin',
      inviteCode: 'ADMIN-2024-001',
      status: 'accepted',
      createdAt: '2024-01-15T14:30:00Z',
      expiresAt: '2024-01-22T14:30:00Z',
      invitedBy: 'admin@swingboudoir.com'
    }
  ]);

  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'moderator' as 'admin' | 'moderator'
  });

  const generateInviteCode = (role: string): string => {
    const prefix = role === 'admin' ? 'ADMIN' : 'MOD';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-2024-${timestamp}`;
  };

  const handleCreateInvite = async () => {
    if (!newInvite.email.trim()) return;

    const inviteCode = generateInviteCode(newInvite.role);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const newInviteData: AdminInvite = {
      id: Date.now().toString(),
      email: newInvite.email,
      role: newInvite.role,
      inviteCode,
      status: 'pending',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      invitedBy: 'admin@swingboudoir.com'
    };

    setInvites(prev => [newInviteData, ...prev]);
    setNewInvite({ email: '', role: 'moderator' });

    await logAdminAction('CREATE_INVITE', 'admin', newInviteData.id, {
      email: newInvite.email,
      role: newInvite.role,
      inviteCode
    });
  };

  const handleCopyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode);
  };

  const handleDeleteInvite = async (inviteId: string) => {
    setInvites(prev => prev.filter(invite => invite.id !== inviteId));
    await logAdminAction('DELETE_INVITE', 'admin', inviteId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-red-500">Admin</Badge>;
      case 'moderator':
        return <Badge variant="default" className="bg-blue-500">Moderator</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Create Admin Invite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="admin@example.com"
                value={newInvite.email}
                onChange={(e) => setNewInvite(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Role</Label>
              <select
                id="inviteRole"
                value={newInvite.role}
                onChange={(e) => setNewInvite(prev => ({ ...prev, role: e.target.value as 'admin' | 'moderator' }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                title="Select admin role"
              >
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleCreateInvite}
                disabled={!newInvite.email.trim()}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Send Invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invites List */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Invites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{invite.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleBadge(invite.role)}
                      {getStatusBadge(invite.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground">
                    <p>Code: {invite.inviteCode}</p>
                    <p className="text-xs">
                      Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyInviteCode(invite.inviteCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  {invite.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteInvite(invite.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {invites.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No admin invites yet</p>
                <p className="text-sm">Create your first invite above</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
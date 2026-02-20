'use client';

import {
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  CardRoot as Card,
  CardBody as CardContent,
  CardHeader,
  Heading as CardTitle,
  Skeleton,
  SkeletonCircle,
  Alert,
  AlertIndicator,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { AvatarFallback } from '@DonaldNgai/chakra-ui';
import { teams, users, team_members } from '@prisma/client';
import { useActionState } from 'react';

// Type for team data with members
export type TeamDataWithMembers = teams & {
  teamMembers: (team_members & { user: users })[];
};

export function SubscriptionSkeleton() {
  return (
    <Card mb={8}>
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <Skeleton height="20px" width="200px" />
          <Skeleton height="16px" width="150px" />
        </VStack>
      </CardContent>
    </Card>
  );
}

export interface ManageSubscriptionProps {
  teamData?: TeamDataWithMembers | null;
  customerPortalAction?: () => Promise<void>;
}

export function ManageSubscription({ teamData, customerPortalAction }: ManageSubscriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <HStack
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            flexDirection={{ base: 'column', sm: 'row' }}
            gap={4}
          >
            <VStack align="start" gap={1}>
              <Text fontWeight="medium" fontSize="md">
                Current Plan: {teamData?.plan_name || 'Free'}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {teamData?.subscription_status === 'active'
                  ? 'Billed monthly'
                  : teamData?.subscription_status === 'trialing'
                  ? 'Trial period'
                  : 'No active subscription'}
              </Text>
            </VStack>
            {customerPortalAction && (
              <form action={customerPortalAction}>
              <Button type="submit" variant="outline">
                Manage Subscription
              </Button>
            </form>
            )}
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

export function TeamMembersSkeleton() {
  return (
    <Card mb={8}>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <HStack gap={4}>
            <SkeletonCircle size="10" />
            <VStack align="start" gap={2}>
              <Skeleton height="16px" width="120px" />
              <Skeleton height="12px" width="60px" />
            </VStack>
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

export interface TeamMembersProps {
  teamData?: TeamDataWithMembers | null;
  removeTeamMemberAction?: (formData: FormData) => Promise<{ error?: string; success?: string }>;
}

export function TeamMembers({ teamData, removeTeamMemberAction }: TeamMembersProps) {
  const actionWrapper = async (
    _state: { error?: string; success?: string },
    formData: FormData
  ): Promise<{ error?: string; success?: string }> => {
    if (!removeTeamMemberAction) {
      return {};
    }
    return await removeTeamMemberAction(formData);
  };

  const [removeState, removeAction, isRemovePending] = useActionState<
    { error?: string; success?: string },
    FormData
  >(actionWrapper, {});

  const getUserDisplayName = (user: Pick<users, 'id' | 'name' | 'email'>) => {
    return user.name || user.email || 'Unknown User';
  };

  if (!teamData?.teamMembers?.length) {
    return (
      <Card mb={8}>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Text color="gray.500">No team members yet.</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card mb={8}>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          {teamData.teamMembers.map((member: team_members & { user: users }, index: number) => (
            <HStack
              key={member.id}
              justify="space-between"
              align="center"
              gap={4}
            >
              <HStack gap={4}>
                <Avatar.Root>
                  <AvatarFallback>
                    {getUserDisplayName(member.user)
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar.Root>
                <VStack align="start" gap={0}>
                  <Text fontWeight="medium" fontSize="md">
                    {getUserDisplayName(member.user)}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="capitalize">
                    {member.role}
                  </Text>
                </VStack>
              </HStack>
              {index > 1 && removeTeamMemberAction ? (
                <form action={removeAction}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={isRemovePending}
                  >
                    {isRemovePending ? 'Removing...' : 'Remove'}
                  </Button>
                </form>
              ) : null}
            </HStack>
          ))}
        </VStack>
        {removeState?.error && (
          <Alert.Root status="error" borderRadius="md" mt={4}>
            <AlertIndicator />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{removeState.error}</AlertDescription>
          </Alert.Root>
        )}
      </CardContent>
    </Card>
  );
}

export function InviteTeamMemberSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <Box>
            <Skeleton height="16px" width="50px" mb={2} />
            <Skeleton height="40px" />
          </Box>
          <Box>
            <Skeleton height="16px" width="40px" mb={2} />
            <HStack gap={4}>
              <Skeleton height="20px" width="80px" />
              <Skeleton height="20px" width="80px" />
            </HStack>
          </Box>
          <Skeleton height="40px" width="150px" />
        </VStack>
      </CardContent>
    </Card>
  );
}

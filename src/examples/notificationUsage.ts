// Example usage of notification triggers throughout your application
// This file shows how to integrate notifications into different features

import {
  triggerVoteReceived,
  triggerContestJoined,
  triggerContestLeft,
  triggerSettingsChanged,
  triggerContestCreated,
  triggerContestUpdated,
  triggerContestEndingReminder,
  triggerPremiumVotes,
  triggerMotivation,
  triggerTip,
  sendDailyRandomNotifications,
  checkContestEndingReminders
} from '@/lib/notificationTriggers';

// ==================== VOTING SYSTEM ====================

/**
 * When someone votes for a model
 */
export const handleVoteForModel = async (
  modelProfileId: string,
  voterName: string,
  contestName: string,
  voteCount: number = 1
) => {
  try {
    // Your existing vote logic here
    // ... save vote to database, update counts, etc.
    
    // Trigger notification for the model
    await triggerVoteReceived(modelProfileId, voterName, contestName, voteCount);
    
    console.log('Vote recorded and notification sent');
  } catch (error) {
    console.error('Error handling vote:', error);
  }
};

// ==================== CONTEST MANAGEMENT ====================

/**
 * When a user joins a contest
 */
export const handleJoinContest = async (
  userProfileId: string,
  contestName: string
) => {
  try {
    // Your existing join contest logic
    // ... add user to contest participants, etc.
    
    // Send notification to user
    await triggerContestJoined(userProfileId, contestName);
    
    console.log('User joined contest and notification sent');
  } catch (error) {
    console.error('Error joining contest:', error);
  }
};

/**
 * When a user leaves a contest
 */
export const handleLeaveContest = async (
  userProfileId: string,
  contestName: string
) => {
  try {
    // Your existing leave contest logic
    // ... remove user from contest participants, etc.
    
    // Send notification to user
    await triggerContestLeft(userProfileId, contestName);
    
    console.log('User left contest and notification sent');
  } catch (error) {
    console.error('Error leaving contest:', error);
  }
};

/**
 * When admin creates a new contest
 */
export const handleCreateContest = async (
  contestName: string,
  eligibleProfileIds: string[]
) => {
  try {
    // Your existing create contest logic
    // ... save contest to database, etc.
    
    // Send notifications to all eligible users
    for (const profileId of eligibleProfileIds) {
      await triggerContestCreated(profileId, contestName);
    }
    
    console.log('Contest created and notifications sent');
  } catch (error) {
    console.error('Error creating contest:', error);
  }
};

/**
 * When admin updates a contest
 */
export const handleUpdateContest = async (
  contestName: string,
  participantProfileIds: string[],
  updateType: string
) => {
  try {
    // Your existing update contest logic
    // ... update contest in database, etc.
    
    // Send notifications to all participants
    for (const profileId of participantProfileIds) {
      await triggerContestUpdated(profileId, contestName, updateType);
    }
    
    console.log('Contest updated and notifications sent');
  } catch (error) {
    console.error('Error updating contest:', error);
  }
};

// ==================== SETTINGS MANAGEMENT ====================

/**
 * When user changes settings
 */
export const handleSettingsChange = async (
  userProfileId: string,
  settingType: string
) => {
  try {
    // Your existing settings update logic
    // ... update settings in database, etc.
    
    // Send notification to user
    await triggerSettingsChanged(userProfileId, settingType);
    
    console.log('Settings updated and notification sent');
  } catch (error) {
    console.error('Error updating settings:', error);
  }
};

// ==================== PREMIUM VOTES ====================

/**
 * When user purchases premium votes
 */
export const handlePremiumVotePurchase = async (
  userProfileId: string,
  voteCount: number,
  amount: number
) => {
  try {
    // Your existing payment logic
    // ... process payment, add votes to user account, etc.
    
    // Send notification to user
    await triggerPremiumVotes(userProfileId, voteCount, amount);
    
    console.log('Premium votes purchased and notification sent');
  } catch (error) {
    console.error('Error purchasing premium votes:', error);
  }
};

// ==================== SCHEDULED TASKS ====================

/**
 * Daily task to send motivation and tips
 * This should be called by a cron job or scheduled task
 */
export const runDailyNotifications = async (activeProfileIds: string[]) => {
  try {
    // Send daily motivation and tips
    for (const profileId of activeProfileIds) {
      await triggerMotivation(profileId);
      await triggerTip(profileId);
    }
    
    // Send random daily notifications
    await sendDailyRandomNotifications(activeProfileIds);
    
    console.log('Daily notifications sent successfully');
  } catch (error) {
    console.error('Error sending daily notifications:', error);
  }
};

/**
 * Check contest ending reminders
 * This should be called by a cron job every hour
 */
export const runContestEndingCheck = async () => {
  try {
    await checkContestEndingReminders();
    console.log('Contest ending reminders checked');
  } catch (error) {
    console.error('Error checking contest ending reminders:', error);
  }
};

// ==================== INTEGRATION EXAMPLES ====================

/**
 * Example: Complete voting flow with notifications
 */
export const completeVotingFlow = async (
  modelProfileId: string,
  voterProfileId: string,
  contestName: string,
  voteCount: number
) => {
  try {
    // 1. Record the vote
    // await recordVote(modelProfileId, voterProfileId, contestName, voteCount);
    
    // 2. Send notification to the model
    await triggerVoteReceived(modelProfileId, 'Anonymous Voter', contestName, voteCount);
    
    // 3. Update contest leaderboard
    // await updateLeaderboard(contestName);
    
    // 4. Check if contest is ending soon and send reminders
    // await checkContestEndingReminders();
    
    console.log('Voting flow completed with notifications');
  } catch (error) {
    console.error('Error in voting flow:', error);
  }
};

/**
 * Example: Contest lifecycle with notifications
 */
export const contestLifecycle = async (
  contestName: string,
  participantProfileIds: string[]
) => {
  try {
    // 1. Contest created
    for (const profileId of participantProfileIds) {
      await triggerContestCreated(profileId, contestName);
    }
    
    // 2. Contest updated (example: deadline extended)
    // await triggerContestUpdated(participantProfileIds, contestName, 'Deadline extended by 24 hours');
    
    // 3. Contest ending reminders (48h, 24h, 1h)
    // These would be triggered by scheduled tasks
    
    console.log('Contest lifecycle notifications set up');
  } catch (error) {
    console.error('Error setting up contest lifecycle:', error);
  }
};

// ==================== ERROR HANDLING ====================

/**
 * Wrapper function to handle notification errors gracefully
 */
export const safeNotificationTrigger = async (
  notificationFunction: () => Promise<void>,
  fallbackMessage: string = 'Notification could not be sent'
) => {
  try {
    await notificationFunction();
  } catch (error) {
    console.error('Notification error:', error);
    // Don't let notification failures break the main functionality
    // You could log this to an error tracking service
  }
};

/**
 * Example usage with error handling
 */
export const handleVoteWithSafeNotification = async (
  modelProfileId: string,
  voterName: string,
  contestName: string
) => {
  try {
    // Your vote logic here
    // ... save vote, update counts, etc.
    
    // Safe notification trigger
    await safeNotificationTrigger(
      () => triggerVoteReceived(modelProfileId, voterName, contestName),
      'Vote notification failed to send'
    );
    
    console.log('Vote processed successfully');
  } catch (error) {
    console.error('Error processing vote:', error);
  }
};

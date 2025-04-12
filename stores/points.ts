import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  claimed?: boolean;
  progress?: number;
  maxProgress?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  icon: string;
  progress?: number;
  maxProgress?: number;
}

interface Purchase {
  id: string;
  title: string;
  description: string;
  amount: number;
  price: number;
  discount?: number;
  popular?: boolean;
}

interface HistoryItem {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: string;
}

export const usePointsStore = defineStore('points', {
  state: () => ({
    balance: 0,
    dailyTasks: [] as Task[],
    inviteTasks: [] as Task[],
    achievements: [] as Achievement[],
    purchases: [] as Purchase[],
    history: [] as HistoryItem[],
    isLoading: false
  }),
  
  getters: {
    hasCompletedTasks: (state) => {
      return state.dailyTasks.some(task => task.completed);
    },
    
    completedDailyTasks: (state) => {
      return state.dailyTasks.filter(task => task.completed && task.claimed).length;
    },
    
    totalDailyTasks: (state) => {
      return state.dailyTasks.length;
    },
    
    completedAchievements: (state) => {
      return state.achievements.filter(achievement => achievement.completed).length;
    },
    
    totalAchievements: (state) => {
      return state.achievements.length;
    },
    
    dailyTasksProgress: (state) => {
      if (state.dailyTasks.length === 0) return 0;
      return (state.dailyTasks.filter(task => task.completed && task.claimed).length / state.dailyTasks.length) * 100;
    }
  },
  
  actions: {
    async fetchPointsData() {
      try {
        this.isLoading = true;
        
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get balance from auth user if available
        const authStore = useAuthStore();
        if (authStore?.user?.points) {
          this.balance = authStore.user.points;
        } else {
          this.balance = 1500;
        }
        
        // Daily tasks
        this.dailyTasks = [
          {
            id: 'daily-login',
            title: '每日登录',
            description: '登录获取奖励',
            reward: 50,
            completed: true,
            claimed: true
          },
          {
            id: 'daily-chat',
            title: '每日聊天',
            description: '完成一次聊天',
            reward: 100,
            completed: true,
            claimed: false
          },
          {
            id: 'daily-comment',
            title: '每日评论',
            description: '评论一个角色',
            reward: 30,
            completed: false,
            claimed: false
          }
        ];
        
        // Invite tasks
        this.inviteTasks = [
          {
            id: 'invite-free',
            title: '邀请用户',
            description: '邀请新用户注册',
            reward: 200,
            completed: false,
            progress: 2,
            maxProgress: 5
          },
          {
            id: 'invite-premium',
            title: '邀请付费用户',
            description: '被邀请用户成为付费会员',
            reward: 1000,
            completed: false,
            progress: 0,
            maxProgress: 3
          }
        ];
        
        // Achievements
        this.achievements = [
          {
            id: 'achievement-first-like',
            title: '初次点赞',
            description: '第一次点赞角色',
            reward: 100,
            completed: true,
            icon: 'heroicons:hand-thumb-up'
          },
          {
            id: 'achievement-first-comment',
            title: '初次评论',
            description: '第一次评论角色',
            reward: 100,
            completed: true,
            icon: 'heroicons:chat-bubble-left-right'
          },
          {
            id: 'achievement-first-favorite',
            title: '初次收藏',
            description: '第一次收藏角色',
            reward: 100,
            completed: true,
            icon: 'heroicons:star'
          },
          {
            id: 'achievement-first-character',
            title: '初次创作',
            description: '创建第一个角色',
            reward: 500,
            completed: false,
            icon: 'heroicons:user-plus'
          },
          {
            id: 'achievement-login-streak',
            title: '连续登录',
            description: '连续登录7天',
            reward: 300,
            completed: false,
            progress: 3,
            maxProgress: 7,
            icon: 'heroicons:calendar'
          },
          {
            id: 'achievement-character-count',
            title: '角色大师',
            description: '创建10个角色',
            reward: 1000,
            completed: false,
            progress: 2,
            maxProgress: 10,
            icon: 'heroicons:user-group'
          },
          {
            id: 'achievement-likes-received',
            title: '受欢迎创作者',
            description: '角色获得100个点赞',
            reward: 800,
            completed: false,
            progress: 37,
            maxProgress: 100,
            icon: 'heroicons:heart'
          },
          {
            id: 'achievement-chat-count',
            title: '聊天达人',
            description: '完成100次聊天',
            reward: 800,
            completed: false,
            progress: 23,
            maxProgress: 100,
            icon: 'heroicons:chat-bubble-oval-left-ellipsis'
          }
        ];
        
        // Purchase options
        this.purchases = [
          {
            id: 'purchase-small',
            title: '体验礼包',
            description: '适合日常使用',
            amount: 1000,
            price: 10,
          },
          {
            id: 'purchase-medium',
            title: '人气礼包',
            description: '最受欢迎的选择',
            amount: 3000,
            price: 25,
            discount: 0.15,
            popular: true
          },
          {
            id: 'purchase-large',
            title: '至尊礼包',
            description: '长期使用的最佳选择',
            amount: 10000,
            price: 60,
            discount: 0.40
          }
        ];
        
        // Mock transaction history
        this.history = [
          {
            id: 'history-1',
            type: 'earn',
            amount: 50,
            description: '每日登录奖励',
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString()
          },
          {
            id: 'history-2',
            type: 'earn',
            amount: 100,
            description: '初次点赞成就',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
          },
          {
            id: 'history-3',
            type: 'spend',
            amount: 20,
            description: '聊天消耗',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
          },
          {
            id: 'history-4',
            type: 'earn',
            amount: 1000,
            description: '点数购买',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
          }
        ];
      } catch (error) {
        console.error('Error fetching points data:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchMoreHistory() {
      try {
        this.isLoading = true;
        
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate more mock history items
        const moreHistory: HistoryItem[] = [];
        
        // Generate some random history items
        const types: ('earn' | 'spend')[] = ['earn', 'spend'];
        const earnDescriptions = [
          '每日登录奖励', 
          '完成任务奖励', 
          '成就奖励', 
          '邀请用户奖励',
          '连续登录奖励',
          '点数购买'
        ];
        const spendDescriptions = [
          '聊天消耗', 
          '使用高级模型',
          '购买角色卡',
          '解锁特殊功能',
          '兑换头像框'
        ];
        
        // Generate 20 more random history entries
        for (let i = 1; i <= 20; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          const descriptions = type === 'earn' ? earnDescriptions : spendDescriptions;
          const description = descriptions[Math.floor(Math.random() * descriptions.length)];
          const amount = type === 'earn' 
            ? Math.floor(Math.random() * 500) + 50
            : Math.floor(Math.random() * 100) + 10;
          
          // Random date within the last 30 days
          const daysAgo = Math.floor(Math.random() * 30) + 3; // 3-33 days ago
          const timestamp = new Date(Date.now() - (1000 * 60 * 60 * 24 * daysAgo) - (Math.random() * 1000 * 60 * 60 * 12)).toISOString();
          
          moreHistory.push({
            id: `history-extended-${i}`,
            type,
            amount,
            description,
            timestamp
          });
        }
        
        // Add to existing history
        this.history = [...this.history, ...moreHistory];
        
        // Sort by timestamp (newest first)
        this.history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        return this.history;
      } catch (error) {
        console.error('Error fetching more history:', error);
        return this.history;
      } finally {
        this.isLoading = false;
      }
    },
    
    async completeTask(taskId: string) {
      try {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the task in either daily or invite tasks
        const dailyTask = this.dailyTasks.find(task => task.id === taskId);
        const inviteTask = this.inviteTasks.find(task => task.id === taskId);
        
        if (dailyTask) {
          if (dailyTask.completed && !dailyTask.claimed) {
            // If task is completed but not claimed, mark as claimed
            dailyTask.claimed = true;
            this.balance += dailyTask.reward;
            
            // Add to history
            this.history.unshift({
              id: `history-${Date.now()}`,
              type: 'earn',
              amount: dailyTask.reward,
              description: `完成任务: ${dailyTask.title}`,
              timestamp: new Date().toISOString()
            });
            
            return true;
          }
        }
        
        if (inviteTask && !inviteTask.completed && inviteTask.progress === inviteTask.maxProgress) {
          inviteTask.completed = true;
          this.balance += inviteTask.reward;
          
          // Add to history
          this.history.unshift({
            id: `history-${Date.now()}`,
            type: 'earn',
            amount: inviteTask.reward,
            description: `完成任务: ${inviteTask.title}`,
            timestamp: new Date().toISOString()
          });
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error completing task:', error);
        return false;
      }
    },
    
    async claimAchievement(achievementId: string) {
      try {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const achievement = this.achievements.find(a => a.id === achievementId);
        
        if (achievement && !achievement.completed && 
            ((achievement.progress !== undefined && 
              achievement.maxProgress !== undefined && 
              achievement.progress >= achievement.maxProgress) || 
             (achievement.progress === undefined))) {
          achievement.completed = true;
          this.balance += achievement.reward;
          
          // Add to history
          this.history.unshift({
            id: `history-${Date.now()}`,
            type: 'earn',
            amount: achievement.reward,
            description: `获得成就: ${achievement.title}`,
            timestamp: new Date().toISOString()
          });
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error claiming achievement:', error);
        return false;
      }
    },
    
    async purchasePoints(purchaseId: string) {
      // Check if user is authenticated
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        authStore.setAuthModalVisibility(true);
        return false;
      }
      
      try {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const purchase = this.purchases.find(p => p.id === purchaseId);
        
        if (purchase) {
          this.balance += purchase.amount;
          
          // Add to history
          this.history.unshift({
            id: `history-${Date.now()}`,
            type: 'earn',
            amount: purchase.amount,
            description: `购买点数: ${purchase.title}`,
            timestamp: new Date().toISOString()
          });
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error purchasing points:', error);
        return false;
      }
    }
  }
});
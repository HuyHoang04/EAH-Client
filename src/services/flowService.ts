import { postRequest, getRequest, putRequest, api } from '@/utils/api';
import { decodeToken, getToken } from '@/utils/auth';
import { NODE_RUNNER_URL } from '@/constants/api';

export interface FlowDto {
  id?: string;
  userId: string;
  name: string;
  description: string;
  isActive: boolean;
  reactFlowData?: string; // JSON string containing nodes and edges
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFlowRequest {
  name: string;
  description: string;
  reactFlowData?: string; // Optional: Template data
}

export interface FlowResponse extends FlowDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class FlowService {
  private static getUserIdFromToken(): string | null {
    const token = getToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    return decoded?.userId || decoded?.id || decoded?.sub || null;
  }

  static async createFlow(flowData: CreateFlowRequest): Promise<FlowResponse> {
    try {
      const userId = this.getUserIdFromToken();

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const requestData: FlowDto = {
        userId,
        name: flowData.name.trim(),
        description: flowData.description.trim(),
        isActive: false,
        reactFlowData: flowData.reactFlowData, // Include template data if provided
      };

      const response = await postRequest<FlowResponse>(
        `${NODE_RUNNER_URL}/flows`,
        requestData,
        true // Cần auth header
      );

      return response;
    } catch (error) {
      console.error('Failed to create flow:', error);
      throw error;
    }
  }

  static async getFlows(): Promise<FlowResponse[]> {
    try {
      const userId = this.getUserIdFromToken();

      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('[FlowService] Getting flows for user:', userId);

      const response = await getRequest<FlowResponse[]>(
        `${NODE_RUNNER_URL}/flows/user/${userId}`,
        true // Cần auth header
      );

      return response;
    } catch (error) {
      console.error('Failed to fetch flows:', error);
      throw error;
    }
  }

  static async getFlowById(flowId: string): Promise<FlowResponse> {
    try {
      const response = await getRequest<FlowResponse>(
        `${NODE_RUNNER_URL}/flows/${flowId}`,
        true // Cần auth header
      );

      return response;
    } catch (error) {
      console.error('Failed to fetch flow:', error);
      throw error;
    }
  }

  static async updateFlow(
    flowId: string, 
    flowData: Partial<FlowDto>
  ): Promise<FlowResponse> {
    try {
      const response = await putRequest<FlowResponse>(
        `${NODE_RUNNER_URL}/flows/${flowId}`,
        flowData,
        true // Cần auth header
      );

      return response;
    } catch (error) {
      console.error('Failed to update flow:', error);
      throw error;
    }
  }

  static async deleteFlow(flowId: string): Promise<void> {
    try {
      await api.delete(`/flows/${flowId}`, { useAuth: true });
    } catch (error) {
      console.error('Failed to delete flow:', error);
      throw error;
    }
  }
}
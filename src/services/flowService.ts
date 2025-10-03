import { postRequest, getRequest } from '@/utils/api';
import { decodeToken, getToken } from '@/utils/auth';
import { FLOW_URL } from '@/constants/api';

export interface FlowDto {
  id?: string;
  userId: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFlowRequest {
  name: string;
  description: string;
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
      };

      const response = await postRequest<FlowResponse>(
        `${FLOW_URL}/api/flows`,
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

      const response = await getRequest<FlowResponse[]>(
        `${FLOW_URL}/api/flows/user/${userId}`,
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
        `${FLOW_URL}/api/flows/${flowId}`,
        true // Cần auth header
      );

      return response;
    } catch (error) {
      console.error('Failed to fetch flow:', error);
      throw error;
    }
  }

  static async updateFlow(flowId: string, flowData: Partial<CreateFlowRequest & { isActive: boolean }>): Promise<FlowResponse> {
    try {
      const response = await postRequest<FlowResponse>(
        `${FLOW_URL}/api/flows/${flowId}`,
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
      await postRequest(
        `${FLOW_URL}/api/flows/${flowId}/delete`,
        {},
        true // Cần auth header
      );
    } catch (error) {
      console.error('Failed to delete flow:', error);
      throw error;
    }
  }
}
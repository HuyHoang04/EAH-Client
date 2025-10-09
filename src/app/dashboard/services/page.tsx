'use client';

import { useState, useEffect } from 'react';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'checking';
  responseTime?: number;
  lastPing?: Date;
  error?: string;
}

export default function ServiceHealthPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Flow Service (Spring Boot)',
      url: process.env.NEXT_PUBLIC_FLOW_SERVICE_URL || '',
      status: 'offline',
    },
    {
      name: 'Gateway (NestJS)',
      url: process.env.NEXT_PUBLIC_GATEWAY_URL || '',
      status: 'offline',
    },
    {
      name: 'Node Runner (NestJS)',
      url: process.env.NEXT_PUBLIC_NODE_RUNNER_URL || '',
      status: 'offline',
    },
  ]);

  const [isAutoPing, setIsAutoPing] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Auto-ping every 1 minute
  useEffect(() => {
    if (!isAutoPing) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          pingAllServices();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoPing]);

  const pingService = async (serviceIndex: number) => {
    const service = services[serviceIndex];
    const startTime = Date.now();

    // Update status to checking
    setServices((prev) =>
      prev.map((s, i) =>
        i === serviceIndex
          ? { ...s, status: 'checking' as const, error: undefined }
          : s
      )
    );

    try {
      const response = await fetch(`${service.url}/up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ping: 'Ping' }),
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
        const data = await response.json();

        if (data.pong === 'Pong') {
          setServices((prev) =>
            prev.map((s, i) =>
              i === serviceIndex
                ? {
                    ...s,
                    status: 'online' as const,
                    responseTime,
                    lastPing: new Date(),
                  }
                : s
            )
          );
        } else {
          throw new Error('Invalid response');
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setServices((prev) =>
        prev.map((s, i) =>
          i === serviceIndex
            ? {
                ...s,
                status: 'offline' as const,
                responseTime: Date.now() - startTime,
                lastPing: new Date(),
                error: error instanceof Error ? error.message : 'Unknown error',
              }
            : s
        )
      );
    }
  };

  const pingAllServices = async () => {
    for (let i = 0; i < services.length; i++) {
      await pingService(i);
      // Small delay between pings
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  const toggleAutoPing = () => {
    setIsAutoPing(!isAutoPing);
    if (!isAutoPing) {
      setCountdown(60);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'checking':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return '🟢';
      case 'offline':
        return '🔴';
      case 'checking':
        return '🟡';
      default:
        return '⚪';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Service Health Monitor
        </h1>
        <p className="text-gray-600">
          Real-time monitoring of all backend services
        </p>
      </div>

      {/* Control Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={pingAllServices}
          disabled={services.some((s) => s.status === 'checking')}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Ping All Services
        </button>

        <button
          onClick={toggleAutoPing}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isAutoPing
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isAutoPing ? (
            <>⏸️ Stop Auto-Ping ({countdown}s)</>
          ) : (
            <>▶️ Start Auto-Ping (60s)</>
          )}
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={service.name}
            className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {service.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  service.status
                )}`}
              >
                {getStatusIcon(service.status)} {service.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">URL:</span>{' '}
                <code className="bg-gray-100 px-1 rounded">{service.url}</code>
              </p>

              {service.responseTime !== undefined && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Response:</span>{' '}
                  <span
                    className={
                      service.responseTime < 100
                        ? 'text-green-600 font-semibold'
                        : service.responseTime < 500
                        ? 'text-yellow-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {service.responseTime}ms
                  </span>
                </p>
              )}

              {service.lastPing && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Last Ping:</span>{' '}
                  {service.lastPing.toLocaleTimeString()}
                </p>
              )}

              {service.error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  <span className="font-medium">Error:</span> {service.error}
                </p>
              )}
            </div>

            <button
              onClick={() => pingService(index)}
              disabled={service.status === 'checking'}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                service.status === 'checking'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
            >
              {service.status === 'checking' ? '⏳ Pinging...' : '🏓 Ping'}
            </button>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📖 How it works
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Sends <code className="bg-blue-100 px-1 rounded">POST</code>{' '}
              request to{' '}
              <code className="bg-blue-100 px-1 rounded">/up</code> endpoint
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Expects JSON response:{' '}
              <code className="bg-blue-100 px-1 rounded">
                {JSON.stringify({ pong: 'Pong' })}
              </code>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Measures response time and connection status</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Auto-ping runs every 60 seconds when enabled (countdown visible)
            </span>
          </li>
        </ul>
      </div>

      {/* Status Legend */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          📊 Status Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟢</span>
            <div>
              <p className="font-medium text-sm">Online</p>
              <p className="text-xs text-gray-600">Service responding</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔴</span>
            <div>
              <p className="font-medium text-sm">Offline</p>
              <p className="text-xs text-gray-600">Service unreachable</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟡</span>
            <div>
              <p className="font-medium text-sm">Checking</p>
              <p className="text-xs text-gray-600">Ping in progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

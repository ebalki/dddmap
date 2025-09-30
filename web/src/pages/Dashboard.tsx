import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Box, Zap, ArrowRight } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useProject } from '../contexts/ProjectContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { boundedContexts } = useProject();

  const totalAggregates = boundedContexts.reduce((sum, ctx) => sum + ctx.aggregates.length, 0);
  const totalCommands = boundedContexts.reduce(
    (sum, ctx) => sum + ctx.aggregates.reduce((s, agg) => s + agg.commands.length, 0),
    0
  );
  const totalEvents = boundedContexts.reduce(
    (sum, ctx) => sum + ctx.aggregates.reduce((s, agg) => s + agg.events.length, 0),
    0
  );

  return (
    <AppShell>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">E-Commerce Platform</h1>
            <p className="text-lg text-gray-600">
              Domain-Driven Design modeling and development workspace
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bounded Contexts</p>
                    <p className="text-3xl font-bold text-gray-900">{boundedContexts.length}</p>
                  </div>
                  <Box className="w-8 h-8 text-blue-500" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Aggregates</p>
                    <p className="text-3xl font-bold text-gray-900">{totalAggregates}</p>
                  </div>
                  <Box className="w-8 h-8 text-yellow-500" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Commands</p>
                    <p className="text-3xl font-bold text-gray-900">{totalCommands}</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-500" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Events</p>
                    <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
                  </div>
                  <Zap className="w-8 h-8 text-orange-500" />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card hover onClick={() => navigate('/context-map')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Map className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Context Map</h3>
                      <p className="text-sm text-gray-600">Strategic design view</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Visualize relationships between bounded contexts and understand integration patterns
                </p>
              </CardBody>
            </Card>

            <Card hover onClick={() => navigate('/requirement/new')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">New Requirement</h3>
                      <p className="text-sm text-gray-600">AI-powered DDD mapping</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Describe a new feature and let AI map it to DDD concepts and generate code
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Bounded Contexts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bounded Contexts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boundedContexts.map((context) => (
                <Card key={context.id} hover onClick={() => navigate(`/context/${context.id}`)}>
                  <CardHeader className={context.color}>
                    <h3 className="text-lg font-semibold text-gray-900">{context.name}</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm text-gray-700 mb-4">{context.description}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Aggregates</span>
                        <span className="font-medium">{context.aggregates.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Integrations</span>
                        <span className="font-medium">{context.integrations.length}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
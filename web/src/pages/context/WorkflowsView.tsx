import React from 'react';
import { GitBranch } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const WorkflowsView: React.FC = () => {
  const { currentContext } = useBoundedContext();

  if (!currentContext) return null;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <GitBranch className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          </div>
          <p className="text-gray-600">Code generation workflows for {currentContext.name}</p>
        </div>

        <Card>
          <CardBody>
            <div className="text-center py-12">
              <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Workflows</h3>
              <p className="text-gray-600">
                Workflows will appear here when you create new requirements and trigger code generation
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
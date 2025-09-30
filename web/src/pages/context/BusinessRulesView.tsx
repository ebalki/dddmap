import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const BusinessRulesView: React.FC = () => {
  const { currentContext } = useBoundedContext();

  if (!currentContext) return null;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Business Rules</h1>
          </div>
          <p className="text-gray-600">Domain rules and invariants in {currentContext.name}</p>
        </div>

        <div className="space-y-8">
          {currentContext.aggregates.map((aggregate) => (
            <div key={aggregate.id}>
              {aggregate.businessRules.length > 0 && (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge variant="aggregate">{aggregate.name}</Badge>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {aggregate.businessRules.length} Rule{aggregate.businessRules.length !== 1 ? 's' : ''}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {aggregate.businessRules.map((rule) => (
                      <Card key={rule.id}>
                        <CardHeader className="bg-green-50">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Description</p>
                              <p className="text-gray-900">{rule.description}</p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600 mb-2">Invariant</p>
                              <code className="block bg-gray-900 text-green-400 px-4 py-3 rounded font-mono text-sm">
                                {rule.invariant}
                              </code>
                            </div>

                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-600">Enforced by:</p>
                              <Badge variant="aggregate">{aggregate.name}</Badge>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {currentContext.aggregates.every(agg => agg.businessRules.length === 0) && (
          <Card>
            <CardBody>
              <p className="text-center text-gray-500 py-8">
                No business rules defined for this context yet
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
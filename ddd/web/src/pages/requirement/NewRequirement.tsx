import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const NewRequirement: React.FC = () => {
  return (
    <AppShell>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">New Requirement</h1>
            <p className="text-gray-600">Describe a new feature and let AI map it to DDD concepts</p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Requirement Details</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the feature"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Bounded Context
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Order Management</option>
                    <option>Inventory</option>
                    <option>Payment</option>
                    <option>Fulfillment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the business capability, trigger, desired outcome, and actors involved..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Analyze with AI</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};
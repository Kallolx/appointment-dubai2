import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Shield,
  HelpCircle,
  Building,
  MapPin,
  Plus,
} from "lucide-react";
import NewAdminLayout from "./NewAdminLayout";
import FaqManagement from "./content/FaqManagement";
import TermsManagement from "./content/TermsManagement";
import PrivacyManagement from "./content/PrivacyManagement";
import SitemapManagement from "./content/SitemapManagement";
import CareersManagement from "./content/CareersManagement";

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("faq");

  const contentSections = [
    {
      id: "faq",
      label: "FAQ",
      icon: HelpCircle,
      description: "Manage frequently asked questions",
      color: "bg-blue-500",
    },
    {
      id: "terms",
      label: "Terms & Conditions",
      icon: FileText,
      description: "Manage terms and conditions content",
      color: "bg-green-500",
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      icon: Shield,
      description: "Manage privacy policy content",
      color: "bg-purple-500",
    },
    {
      id: "sitemap",
      label: "Sitemap",
      icon: MapPin,
      description: "Manage sitemap links and content",
      color: "bg-orange-500",
    },
    {
      id: "careers",
      label: "Careers",
      icon: Building,
      description: "Manage career opportunities",
      color: "bg-red-500",
    },
  ];

  return (
    <NewAdminLayout 
      title="Content Management" 
      subtitle="Manage website content including FAQ, Terms, Privacy Policy, Sitemap, and Careers"
    >
      <div className="space-y-6">
        {/* Content Sections Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {contentSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  activeTab === section.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveTab(section.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${section.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {section.label}
                  </h3>
                  <p className="text-xs text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Management Tabs (cards act as selectors) */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mt-6">
            <TabsContent value="faq">
              <FaqManagement />
            </TabsContent>

            <TabsContent value="terms">
              <TermsManagement />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacyManagement />
            </TabsContent>

            <TabsContent value="sitemap">
              <SitemapManagement />
            </TabsContent>

            <TabsContent value="careers">
              <CareersManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </NewAdminLayout>
  );
};

export default ContentManagement;

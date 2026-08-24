import React from 'react';
import { Invoice, BusinessProfile, TemplateStyle } from '../../types';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { CorporateTemplate } from './CorporateTemplate';
import { PrintingHubTemplate } from './PrintingHubTemplate';

interface TemplateRendererProps {
  invoice: Invoice;
  business: BusinessProfile;
  overrideTemplate?: TemplateStyle;
  previewMode?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  invoice,
  business,
  overrideTemplate,
  previewMode,
}) => {
  const selectedTemplate = overrideTemplate || invoice.template || business.defaultTemplate || 'modern';

  switch (selectedTemplate) {
    case 'minimal':
      return <MinimalTemplate invoice={invoice} business={business} previewMode={previewMode} />;
    case 'creative':
      return <CreativeTemplate invoice={invoice} business={business} previewMode={previewMode} />;
    case 'corporate':
      return <CorporateTemplate invoice={invoice} business={business} previewMode={previewMode} />;
    case 'printing-hub':
      return <PrintingHubTemplate invoice={invoice} business={business} previewMode={previewMode} />;
    case 'modern':
    default:
      return <ModernTemplate invoice={invoice} business={business} previewMode={previewMode} />;
  }
};

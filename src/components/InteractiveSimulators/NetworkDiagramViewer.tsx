import React, { useState } from 'react';
import { Layers, Network, CheckCircle2, ChevronRight, Info, Radio, Zap, Layout } from 'lucide-react';
import { TelecomNetworkSchematic } from '../TelecomNetworkSchematic';

export const NetworkDiagramViewer: React.FC = () => {
  return (
    <div className="space-y-6">
      <TelecomNetworkSchematic />
    </div>
  );
};

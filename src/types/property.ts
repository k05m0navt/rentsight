export interface Property {
  id: string;
  user_id: string;
  name: string;
  address?: string | null;
  property_type?: string | null;
  start_date?: Date | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PropertyWithStats extends Property {
  _count?: {
    rentEntries: number;
    expenseEntries: number;
  };
}

export interface PropertyCreateInput {
  name: string;
  address?: string;
  property_type?: 'apartment' | 'house' | 'condo' | 'townhouse' | 'duplex' | 'other';
  start_date?: string; // ISO date string
  notes?: string;
}

export interface PropertyUpdateInput {
  name?: string;
  address?: string;
  property_type?: 'apartment' | 'house' | 'condo' | 'townhouse' | 'duplex' | 'other';
  start_date?: string; // ISO date string
  notes?: string;
}

export interface PropertyListResponse {
  items: PropertyWithStats[];
  nextCursor: string | null;
  total: number;
}


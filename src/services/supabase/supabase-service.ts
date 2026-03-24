import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export class SupabaseService<T extends { id?: string }> {
  protected collection: string;

  constructor(collection: string) {
    this.collection = collection;
  }

  protected handleError(error: PostgrestError | Error) {
    console.error(`Supabase Error [${this.collection}]:`, error);
    throw error;
  }

  async getAll(params?: any): Promise<T[]> {
    let query = supabase.from(this.collection).select('*');
    
    if (params?.teacherId) {
      query = query.eq('teacher_id', params.teacherId);
    }

    const { data, error } = await query;
    if (error) this.handleError(error);
    return (data as T[]) || [];
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.collection)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') this.handleError(error);
    return (data as T) || null;
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: created, error } = await supabase
      .from(this.collection)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) this.handleError(error);
    return created as T;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await supabase
      .from(this.collection)
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) this.handleError(error);
    return updated as T;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.collection)
      .delete()
      .eq('id', id);

    if (error) this.handleError(error);
  }
}

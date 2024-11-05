import {Injectable} from '@angular/core';
import {AuthChangeEvent, createClient, Session, SupabaseClient, User} from '@supabase/supabase-js';
import {Router} from "@angular/router";

export interface IUser {
  email: string;
  games: number;
  wins: number;
}


@Injectable({
  providedIn: 'root'
})


export class SupabaseService {
  loading: boolean;
  user: IUser;
  errorMessage: string;

  public supabase: SupabaseClient;
  public isAuthenticated = false;
  private SUPABASE_URL = 'https://sqbcxoqahqnnilpzhavb.supabase.co';
  private SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxYmN4b3FhaHFubmlscHpoYXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNDMwNjcsImV4cCI6MjAzODYxOTA2N30.inloCcDbSo5H2Dzq6Pzz83xjFJYAcK_3099Rai9rGzU';

  constructor(private router: Router) {
    this.supabase = createClient(this.SUPABASE_URL, this.SUPABASE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );
    this.loading = false;
    this.user = {} as IUser;
    this.errorMessage = '';
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }


  public async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data.user;
  }


  public async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  public async getProfile(): Promise<any> {
    const user = await this.getUser();

    if (!user) {
      console.error('User not found');
      return null;
    }

    const { data, error } = await this.supabase
      .from('profiles')
      .select('email, games, wins')
      .eq('email', user.email)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }


  async signIn(email: string, password: string): Promise<boolean> {
    try {
      this.loading = true;
      const { error } = await this.supabase.auth.signInWithPassword({ email, password });

      if (error) {
        this.errorMessage = error.message;
        return false;
      } else {
        this.errorMessage = '';
        this.isAuthenticated = true;
        await this.router.navigate(['/game']);
        return true;
      }
    } catch (err) {
      console.error("Sign-in failed:", err);
      this.errorMessage = "Sign-in failed. Please try again.";
      return false;
    } finally {
      this.loading = false;
    }
  }



  public signOut(): Promise<any> {
    this.isAuthenticated = false;
    return this.supabase.auth.signOut();
  }


  public async saveGameStats(won: boolean): Promise<void> {
    const user = await this.getUser();

    if (!user) {
      console.error('User not found');
      return;
    }

    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('games, wins')
      .eq('email', user.email)
      .single();

    if (error || !profile) {
      console.error('Error fetching profile for stats update:', error);
      return;
    }


    const updatedGames = profile.games + 1;
    const updatedWins = won ? profile.wins + 1 : profile.wins;

    const { error: updateError } = await this.supabase
      .from('profiles')
      .update({ games: updatedGames, wins: updatedWins })
      .eq('email', user.email);

    if (updateError) {
      console.error('Error updating game stats:', updateError);
    } else {
      console.log('Game stats updated successfully');
    }
  }

}

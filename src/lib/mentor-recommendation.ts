import { MentorData } from './mentors';

/**
 * Modular Scoring Engine for Mentor Comparison & Recommendation
 */

export interface ScoringWeights {
  domain: number;
  skills: number;
  experience: number;
  organization: number;
  quality: number;
  location: number;
}

export const defaultWeights: ScoringWeights = {
  domain: 0.30,
  skills: 0.20,
  experience: 0.15,
  organization: 0.15,
  quality: 0.10,
  location: 0.10,
};

export interface UserPreferences {
  desired_domain?: string;
  required_skills?: string[];
  preferred_location?: string;
  weights?: Partial<ScoringWeights>;
}

export interface ScoreBreakdown {
  domain: number;
  skills: number;
  experience: number;
  organization: number;
  quality: number;
  location: number;
  total: number;
  explanation: string;
}

export class ScoringEngine {
  private weights: ScoringWeights;

  constructor(customWeights?: Partial<ScoringWeights>) {
    this.weights = { ...defaultWeights, ...customWeights };
  }

  /**
   * Domain Matching Score (Direct & Related)
   */
  public calculateDomainScore(mentorDomain: string, desiredDomain?: string): number {
    if (!desiredDomain) return 1.0;
    
    const mDomain = mentorDomain.toLowerCase();
    const dDomain = desiredDomain.toLowerCase();

    // Exact Match
    if (mDomain === dDomain) return 1.0;

    // Related Domain Mapping (Handled as simple map for now, extensible to ontology)
    const similarityMap: Record<string, string[]> = {
      'artificial intelligence': ['machine learning', 'deep learning', 'data science', 'ai'],
      'biotechnology': ['genetics', 'bioinformatics', 'molecular biology', 'biotech'],
      'nanotechnology': ['material science', 'nano engineering', 'physics', 'nano-technology'],
      'robotics': ['automation', 'mechanical engineering', 'control systems'],
    };

    if (similarityMap[dDomain]?.includes(mDomain)) return 0.6;
    if (similarityMap[mDomain]?.includes(dDomain)) return 0.6;

    return 0.2;
  }

  /**
   * Skills Matching Score (Intersection-based)
   */
  public calculateSkillScore(mentorSkills: string[], requiredSkills?: string[]): number {
    if (!requiredSkills || requiredSkills.length === 0) return 1.0;

    const mSkills = mentorSkills.map(s => s.toLowerCase());
    const rSkills = requiredSkills.map(s => s.toLowerCase());

    // Handling synonyms (e.g., AI = Machine Learning)
    const synonyms: Record<string, string[]> = {
      'ai': ['artificial intelligence'],
      'machine learning': ['ml'],
      'data engineering': ['big data', 'pipeline'],
      'nlp': ['natural language processing'],
    };

    let matches = 0;
    rSkills.forEach(skill => {
        if (mSkills.includes(skill)) {
            matches++;
        } else {
            // Check synonyms
            const syns = synonyms[skill] || [];
            if (syns.some(s => mSkills.includes(s))) matches++;
        }
    });

    return matches / requiredSkills.length;
  }

  /**
   * Experience Score (Normalized 0-1 scale)
   */
  public calculateExperienceScore(experience: string): number {
    // Extract number from string like "10+ Yrs"
    const years = parseInt(experience.replace(/[^0-9]/g, '')) || 5;
    return Math.min(years / 10, 1.0);
  }

  /**
   * Organization Reputation Score (Predefined map)
   */
  public calculateOrgScore(organization: string): number {
    const reputationMap: Record<string, number> = {
      'google': 1.0,
      'stanford university': 1.0,
      'mit': 1.0,
      'cern': 1.0,
      'iit': 0.9,
      'harvard': 1.0,
      'microsoft': 0.9,
      'nanoschool': 0.8,
    };

    const org = organization.toLowerCase();
    for (const [key, score] of Object.entries(reputationMap)) {
      if (org.includes(key)) return score;
    }

    return 0.5; // Default for others
  }

  /**
   * Mentorship Quality & Location Scores
   */
  public calculateCombinedQuality(rating: number = 4.5, mentees: number = 100, availability: number = 5): number {
    const rScore = rating / 5;
    const mScore = Math.min(mentees / 500, 1.0);
    const aScore = Math.min(availability / 10, 1.0);

    return (rScore * 0.6) + (mScore * 0.2) + (aScore * 0.2);
  }

  public calculateLocationScore(mentorCountry: string, preferredLocation?: string): number {
    if (!preferredLocation) return 1.0;
    const mLoc = mentorCountry.toLowerCase();
    const pLoc = preferredLocation.toLowerCase();

    if (mLoc === pLoc) return 1.0;
    
    const regions: Record<string, string[]> = {
      'asia': ['india', 'china', 'japan', 'singapore', 'korea'],
      'europe': ['uk', 'germany', 'france', 'italy', 'switzerland'],
      'americas': ['usa', 'canada', 'brazil', 'mexico'],
    };

    // Region check (simple proxy for same country/area)
    for (const [region, countries] of Object.entries(regions)) {
        if (countries.includes(mLoc) && countries.includes(pLoc)) return 0.7;
    }

    return 0.4;
  }

  /**
   * Main Scoring Function for a Mentor
   */
  public getScore(mentor: MentorData, prefs: UserPreferences): ScoreBreakdown {
    const dScore = this.calculateDomainScore(mentor.domains[0] || '', prefs.desired_domain);
    const sScore = this.calculateSkillScore(mentor.skills, prefs.required_skills);
    const eScore = this.calculateExperienceScore(mentor.experience);
    const oScore = this.calculateOrgScore(mentor.organization);
    const qScore = this.calculateCombinedQuality(); // Using defaults for now
    const lScore = this.calculateLocationScore(mentor.country, prefs.preferred_location);

    const total = 
      (dScore * this.weights.domain) +
      (sScore * this.weights.skills) +
      (eScore * this.weights.experience) +
      (oScore * this.weights.organization) +
      (qScore * this.weights.quality) +
      (lScore * this.weights.location);

    // Human-readable explanation
    const reasons = [];
    if (dScore >= 0.8) reasons.push('perfect domain match');
    if (sScore >= 0.7) reasons.push('strong skill alignment');
    if (eScore >= 0.8) reasons.push('extensive industry experience');
    if (oScore >= 0.9) reasons.push('high institutional reputation');
    if (qScore >= 0.8) reasons.push('exceptional mentorship quality');

    const explanation = reasons.length > 0 
      ? `${mentor.name.split(' ')[0]} is highly recommended due to ${reasons.slice(0, 2).join(' and ')}.`
      : `${mentor.name.split(' ')[0]} provides a balanced mentorship profile suited for your goals.`;

    return {
      domain: Number(dScore.toFixed(2)),
      skills: Number(sScore.toFixed(2)),
      experience: Number(eScore.toFixed(2)),
      organization: Number(oScore.toFixed(2)),
      quality: Number(qScore.toFixed(2)),
      location: Number(lScore.toFixed(2)),
      total: Number(total.toFixed(2)),
      explanation
    };
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cities: {
        Row: {
          costForExpatInUSD: number
          costForFamilyInUSD: number
          costForLocalInUSD: number
          costForNomadInUSD: number
          costScore: number
          country: string
          createdAt: string
          id: number
          image: string | null
          internetScore: number
          latitude: string
          likesScore: number
          longitude: string
          name: string
          population: number
          region: string
          safetyLevel: number
          slug: string
          totalScore: number
          updatedAt: string
          wifi: number
        }
        Insert: {
          costForExpatInUSD: number
          costForFamilyInUSD: number
          costForLocalInUSD: number
          costForNomadInUSD: number
          costScore: number
          country: string
          createdAt?: string
          id?: number
          image?: string | null
          internetScore: number
          latitude: string
          likesScore: number
          longitude: string
          name: string
          population: number
          region: string
          safetyLevel: number
          slug: string
          totalScore: number
          updatedAt?: string
          wifi: number
        }
        Update: {
          costForExpatInUSD?: number
          costForFamilyInUSD?: number
          costForLocalInUSD?: number
          costForNomadInUSD?: number
          costScore?: number
          country?: string
          createdAt?: string
          id?: number
          image?: string | null
          internetScore?: number
          latitude?: string
          likesScore?: number
          longitude?: string
          name?: string
          population?: number
          region?: string
          safetyLevel?: number
          slug?: string
          totalScore?: number
          updatedAt?: string
          wifi?: number
        }
        Relationships: []
      }
      cities_weathers_averages: {
        Row: {
          apparentTemperatureMax: number | null
          apparentTemperatureMean: number | null
          apparentTemperatureMin: number | null
          cityId: number
          createdAt: string
          daylightDuration: number | null
          et0FaoEvapotranspiration: number | null
          id: number
          month: number
          precipitationHours: number | null
          precipitationSum: number | null
          rainSum: number | null
          shortwaveRadiationSum: number | null
          snowfallSum: number | null
          sunrise: string | null
          sunset: string | null
          sunshineDuration: number | null
          temperatureMax: number | null
          temperatureMean: number | null
          temperatureMin: number | null
          updatedAt: string
          weatherCode: number | null
          windDirection10mDominant: number | null
          windGusts10mMax: number | null
          windSpeed10mMax: number | null
          year: number
        }
        Insert: {
          apparentTemperatureMax?: number | null
          apparentTemperatureMean?: number | null
          apparentTemperatureMin?: number | null
          cityId: number
          createdAt?: string
          daylightDuration?: number | null
          et0FaoEvapotranspiration?: number | null
          id?: number
          month: number
          precipitationHours?: number | null
          precipitationSum?: number | null
          rainSum?: number | null
          shortwaveRadiationSum?: number | null
          snowfallSum?: number | null
          sunrise?: string | null
          sunset?: string | null
          sunshineDuration?: number | null
          temperatureMax?: number | null
          temperatureMean?: number | null
          temperatureMin?: number | null
          updatedAt?: string
          weatherCode?: number | null
          windDirection10mDominant?: number | null
          windGusts10mMax?: number | null
          windSpeed10mMax?: number | null
          year: number
        }
        Update: {
          apparentTemperatureMax?: number | null
          apparentTemperatureMean?: number | null
          apparentTemperatureMin?: number | null
          cityId?: number
          createdAt?: string
          daylightDuration?: number | null
          et0FaoEvapotranspiration?: number | null
          id?: number
          month?: number
          precipitationHours?: number | null
          precipitationSum?: number | null
          rainSum?: number | null
          shortwaveRadiationSum?: number | null
          snowfallSum?: number | null
          sunrise?: string | null
          sunset?: string | null
          sunshineDuration?: number | null
          temperatureMax?: number | null
          temperatureMean?: number | null
          temperatureMin?: number | null
          updatedAt?: string
          weatherCode?: number | null
          windDirection10mDominant?: number | null
          windGusts10mMax?: number | null
          windSpeed10mMax?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "weathers__cityId_fkey"
            columns: ["cityId"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      weathers: {
        Row: {
          apparentTemperatureMax: number | null
          apparentTemperatureMean: number | null
          apparentTemperatureMin: number | null
          cityId: number
          createdAt: string
          daylightDuration: number | null
          et0FaoEvapotranspiration: number | null
          id: number
          precipitationHours: number | null
          precipitationSum: number | null
          rainSum: number | null
          shortwaveRadiationSum: number | null
          snowfallSum: number | null
          sunrise: string | null
          sunset: string | null
          sunshineDuration: number | null
          temperatureMax: number | null
          temperatureMean: number | null
          temperatureMin: number | null
          updatedAt: string
          weatherCode: number | null
          when: string
          windDirection10mDominant: number | null
          windGusts10mMax: number | null
          windSpeed10mMax: number | null
        }
        Insert: {
          apparentTemperatureMax?: number | null
          apparentTemperatureMean?: number | null
          apparentTemperatureMin?: number | null
          cityId: number
          createdAt?: string
          daylightDuration?: number | null
          et0FaoEvapotranspiration?: number | null
          id?: number
          precipitationHours?: number | null
          precipitationSum?: number | null
          rainSum?: number | null
          shortwaveRadiationSum?: number | null
          snowfallSum?: number | null
          sunrise?: string | null
          sunset?: string | null
          sunshineDuration?: number | null
          temperatureMax?: number | null
          temperatureMean?: number | null
          temperatureMin?: number | null
          updatedAt?: string
          weatherCode?: number | null
          when: string
          windDirection10mDominant?: number | null
          windGusts10mMax?: number | null
          windSpeed10mMax?: number | null
        }
        Update: {
          apparentTemperatureMax?: number | null
          apparentTemperatureMean?: number | null
          apparentTemperatureMin?: number | null
          cityId?: number
          createdAt?: string
          daylightDuration?: number | null
          et0FaoEvapotranspiration?: number | null
          id?: number
          precipitationHours?: number | null
          precipitationSum?: number | null
          rainSum?: number | null
          shortwaveRadiationSum?: number | null
          snowfallSum?: number | null
          sunrise?: string | null
          sunset?: string | null
          sunshineDuration?: number | null
          temperatureMax?: number | null
          temperatureMean?: number | null
          temperatureMin?: number | null
          updatedAt?: string
          weatherCode?: number | null
          when?: string
          windDirection10mDominant?: number | null
          windGusts10mMax?: number | null
          windSpeed10mMax?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weathers_userId_fkey"
            columns: ["cityId"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

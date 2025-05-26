// src/utils/cleanObject.ts

export function cleanSignUpData<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([_, value]) =>
        value !== '' &&
        value !== null &&
        !(Array.isArray(value) && value.length === 0)
    )
  ) as Partial<T>;
}

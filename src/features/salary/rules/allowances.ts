/**
 * قوانین مربوط به محاسبه مزایا (حق مسکن، بن کارگری، حق اولاد و...)
 */

import {
  HOUSING_ALLOWANCE_1404,
  FOOD_ALLOWANCE_1404,
  CHILD_ALLOWANCE_PER_CHILD,
  SPOUSE_ALLOWANCE,
  WORKER_COUPON_MONTHLY,
  MISSION_DAILY_RATE,
  TRANSPORTATION_ALLOWANCE,
} from '../constants';

export interface AllowanceInput {
  isMarried?: boolean;
  numberOfChildren?: number;
  missionDays?: number;
  hasTransportation?: boolean;
  hasWorkerCoupon?: boolean;
}

/**
 * محاسبه حق مسکن
 * @returns مبلغ حق مسکن (تومان)
 */
export function calculateHousingAllowance(): number {
  // حق مسکن برای همه کارگران ثابت است
  return HOUSING_ALLOWANCE_1404;
}

/**
 * محاسبه کمک هزینه غذا
 * @returns مبلغ کمک هزینه غذا (تومان)
 */
export function calculateFoodAllowance(): number {
  // کمک هزینه غذا برای همه کارگران ثابت است
  return FOOD_ALLOWANCE_1404;
}

/**
 * محاسبه حق اولاد
 * @param numberOfChildren تعداد فرزندان
 * @param isMarried وضعیت تاهل
 * @returns مبلغ حق اولاد (تومان)
 */
export function calculateChildAllowance(
  numberOfChildren = 0,
  isMarried = false,
): number {
  let total = 0;

  // حق اولاد همسر
  if (isMarried) {
    total += SPOUSE_ALLOWANCE;
  }

  // حق اولاد فرزندان
  if (numberOfChildren > 0) {
    total += numberOfChildren * CHILD_ALLOWANCE_PER_CHILD;
  }

  return total;
}

/**
 * محاسبه بن کارگری
 * @param hasWorkerCoupon آیا مشمول بن کارگری است؟
 * @returns مبلغ بن کارگری (تومان)
 */
export function calculateWorkerCoupon(hasWorkerCoupon = true): number {
  return hasWorkerCoupon ? WORKER_COUPON_MONTHLY : 0;
}

/**
 * محاسبه حق مأموریت
 * @param missionDays تعداد روزهای مأموریت
 * @returns مبلغ حق مأموریت (تومان)
 */
export function calculateMissionAllowance(missionDays = 0): number {
  if (missionDays <= 0) {
    return 0;
  }
  return missionDays * MISSION_DAILY_RATE;
}

/**
 * محاسبه کمک هزینه ایاب‌وذهاب
 * @param hasTransportation آیا مشمول کمک هزینه ایاب‌وذهاب است؟
 * @returns مبلغ کمک هزینه ایاب‌وذهاب (تومان)
 */
export function calculateTransportationAllowance(hasTransportation = true): number {
  return hasTransportation ? TRANSPORTATION_ALLOWANCE : 0;
}

/**
 * محاسبه مجموع مزایا
 * @param baseSalary حقوق پایه (تومان)
 * @param input ورودی مزایا
 * @returns مجموع مزایا (تومان)
 */
export function calculateTotalAllowances(
  baseSalary: number,
  input: AllowanceInput = {},
): number {
  void baseSalary;
  const housing = calculateHousingAllowance();
  const food = calculateFoodAllowance();
  const child = calculateChildAllowance(input.numberOfChildren, input.isMarried);
  const coupon = calculateWorkerCoupon(input.hasWorkerCoupon);
  const mission = calculateMissionAllowance(input.missionDays);
  const transportation = calculateTransportationAllowance(input.hasTransportation);

  return housing + food + child + coupon + mission + transportation;
}

/**
 * دریافت جزئیات مزایا به صورت تفکیک شده
 * @param baseSalary حقوق پایه (تومان)
 * @param input ورودی مزایا
 * @returns جزئیات مزایا
 */
export function getAllowanceDetails(
  baseSalary: number,
  input: AllowanceInput = {},
) {
  void baseSalary;
  return {
    housing: calculateHousingAllowance(),
    food: calculateFoodAllowance(),
    child: calculateChildAllowance(input.numberOfChildren, input.isMarried),
    coupon: calculateWorkerCoupon(input.hasWorkerCoupon),
    mission: calculateMissionAllowance(input.missionDays),
    transportation: calculateTransportationAllowance(input.hasTransportation),
    total: calculateTotalAllowances(baseSalary, input),
  };
}

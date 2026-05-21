import queryString from "query-string";
import {
  type PriceRangeKey,
  type ProductColor,
  type ProductGender,
  type ProductSize,
} from "@/lib/data/mock-products";

export type ProductSortOption =
  | "featured"
  | "newest"
  | "price_desc"
  | "price_asc";

export type ProductQueryState = {
  gender: ProductGender[];
  size: ProductSize[];
  color: ProductColor[];
  price: PriceRangeKey[];
  sort: ProductSortOption;
  page: number;
};

type QueryInput =
  | string
  | Record<string, string | string[] | undefined>;

const defaultState: ProductQueryState = {
  gender: [],
  size: [],
  color: [],
  price: [],
  sort: "featured",
  page: 1,
};

const allowedSorts: ProductSortOption[] = [
  "featured",
  "newest",
  "price_desc",
  "price_asc",
];

function normalizeInput(input: QueryInput) {
  if (typeof input === "string") {
    return queryString.parse(input.startsWith("?") ? input : `?${input}`, {
      arrayFormat: "comma",
    });
  }

  const serialized = queryString.stringify(input, {
    arrayFormat: "comma",
    skipEmptyString: true,
    skipNull: true,
  });

  return queryString.parse(serialized, {
    arrayFormat: "comma",
  });
}

function toArray(
  value: string | Array<string | null> | null | undefined,
) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .flatMap((item) => item.split(","))
      .filter(Boolean);
  }
  return value.split(",").filter(Boolean);
}

function parsePageValue(
  value: string | Array<string | null> | null | undefined,
) {
  const page = Number(
    Array.isArray(value)
      ? value.find((item): item is string => typeof item === "string")
      : value,
  );
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function parseProductQuery(input: QueryInput): ProductQueryState {
  const parsed = normalizeInput(input);
  const sortValue = Array.isArray(parsed.sort) ? parsed.sort[0] : parsed.sort;

  return {
    gender: toArray(parsed.gender) as ProductGender[],
    size: toArray(parsed.size) as ProductSize[],
    color: toArray(parsed.color) as ProductColor[],
    price: toArray(parsed.price) as PriceRangeKey[],
    sort: allowedSorts.includes(sortValue as ProductSortOption)
      ? (sortValue as ProductSortOption)
      : defaultState.sort,
    page: parsePageValue(parsed.page),
  };
}

export function buildProductQueryString(state: Partial<ProductQueryState>) {
  return queryString.stringify(
    {
      gender: state.gender?.length ? state.gender : undefined,
      size: state.size?.length ? state.size : undefined,
      color: state.color?.length ? state.color : undefined,
      price: state.price?.length ? state.price : undefined,
      sort: state.sort && state.sort !== "featured" ? state.sort : undefined,
      page: state.page && state.page > 1 ? state.page : undefined,
    },
    {
      arrayFormat: "comma",
      skipEmptyString: true,
      skipNull: true,
    },
  );
}

export function buildProductsUrl(
  pathname: string,
  state: Partial<ProductQueryState>,
) {
  return queryString.stringifyUrl(
    {
      url: pathname,
      query: queryString.parse(buildProductQueryString(state), {
        arrayFormat: "comma",
      }),
    },
    {
      arrayFormat: "comma",
      skipEmptyString: true,
      skipNull: true,
    },
  );
}

export function toggleMultiValue(
  state: ProductQueryState,
  key: "gender" | "size" | "color" | "price",
  value: string,
): ProductQueryState {
  const values = [...state[key]];
  const nextValues = values.includes(value as never)
    ? values.filter((item) => item !== value)
    : [...values, value];

  return {
    ...state,
    [key]: nextValues as ProductQueryState[typeof key],
    page: 1,
  };
}

export function setSortValue(
  state: ProductQueryState,
  sort: ProductSortOption,
): ProductQueryState {
  return {
    ...state,
    sort,
    page: 1,
  };
}

export function clearAllFilters(state: ProductQueryState): ProductQueryState {
  return {
    ...defaultState,
    sort: state.sort,
  };
}

export function removeFilterValue(
  state: ProductQueryState,
  key: "gender" | "size" | "color" | "price",
  value: string,
): ProductQueryState {
  return {
    ...state,
    [key]: state[key].filter((item) => item !== value),
    page: 1,
  } as ProductQueryState;
}

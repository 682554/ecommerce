"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { and, asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  cartItems,
  carts,
  guest,
  productImages,
  productVariants,
  session,
} from "@/lib/db/schema";
import type { CartActionResult, CartItemView, CartView } from "./cart.types";

type CartOwnerContext = {
  userId: string | null;
  guestId: string | null;
  guestSessionToken: string | null;
  isAuthenticated: boolean;
};

type AddCartItemInput = {
  productVariantId: string;
  quantity?: number;
};

type UpdateCartItemInput = {
  cartItemId: string;
  quantity: number;
  productVariantId?: string;
};

const defaultImage =
  "/static/uploads/products/nike-air-force-1-07/01-nike-air-force-1-07.png";

function toCurrencyNumber(value: string | number | null) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function buildEmptyCart(context: Partial<CartOwnerContext> = {}): CartView {
  return {
    id: null,
    items: [],
    itemCount: 0,
    subtotal: 0,
    total: 0,
    isAuthenticated: context.isAuthenticated ?? false,
    guestSessionToken: context.guestSessionToken ?? null,
  };
}

async function getAuthUserId() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_session")?.value;

  if (!authToken) {
    return null;
  }

  const [sessionRecord] = await db
    .select({
      userId: session.userId,
      expiresAt: session.expiresAt,
    })
    .from(session)
    .where(eq(session.token, authToken))
    .limit(1);

  if (!sessionRecord || new Date() > sessionRecord.expiresAt) {
    cookieStore.delete("auth_session");
    return null;
  }

  return sessionRecord.userId;
}

async function getExistingGuestSession() {
  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value;

  if (!guestToken) {
    return null;
  }

  const [guestRecord] = await db
    .select()
    .from(guest)
    .where(eq(guest.sessionToken, guestToken))
    .limit(1);

  if (!guestRecord || new Date() > guestRecord.expiresAt) {
    cookieStore.delete("guest_session");
    return null;
  }

  return guestRecord;
}

async function ensureGuestSession() {
  const existing = await getExistingGuestSession();
  if (existing) {
    return existing;
  }

  const cookieStore = await cookies();
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [guestRecord] = await db
    .insert(guest)
    .values({
      sessionToken,
      expiresAt,
    })
    .returning();

  cookieStore.set("guest_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return guestRecord;
}

async function resolveCartOwnerContext(
  createGuestIfMissing = false,
): Promise<CartOwnerContext> {
  const userId = await getAuthUserId();

  if (userId) {
    const guestRecord = await getExistingGuestSession();
    return {
      userId,
      guestId: guestRecord?.id ?? null,
      guestSessionToken: guestRecord?.sessionToken ?? null,
      isAuthenticated: true,
    };
  }

  const guestRecord = createGuestIfMissing
    ? await ensureGuestSession()
    : await getExistingGuestSession();

  return {
    userId: null,
    guestId: guestRecord?.id ?? null,
    guestSessionToken: guestRecord?.sessionToken ?? null,
    isAuthenticated: false,
  };
}

async function findCartForOwner(context: CartOwnerContext) {
  if (context.userId) {
    return db.query.carts.findFirst({
      where: eq(carts.userId, context.userId),
      columns: {
        id: true,
        userId: true,
        guestId: true,
      },
    });
  }

  if (context.guestId) {
    return db.query.carts.findFirst({
      where: eq(carts.guestId, context.guestId),
      columns: {
        id: true,
        userId: true,
        guestId: true,
      },
    });
  }

  return null;
}

async function ensureCartForOwner(context: CartOwnerContext) {
  const existingCart = await findCartForOwner(context);
  if (existingCart) {
    return existingCart;
  }

  if (!context.userId && !context.guestId) {
    return null;
  }

  const [createdCart] = await db
    .insert(carts)
    .values({
      userId: context.userId,
      guestId: context.userId ? null : context.guestId,
    })
    .returning({
      id: carts.id,
      userId: carts.userId,
      guestId: carts.guestId,
    });

  return createdCart;
}

async function buildCartView(
  cartId: string | null,
  context: CartOwnerContext,
): Promise<CartView> {
  if (!cartId) {
    return buildEmptyCart(context);
  }

  const cartRecord = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
    with: {
      items: {
        orderBy: [asc(cartItems.id)],
        with: {
          productVariant: {
            with: {
              color: true,
              size: true,
              images: {
                orderBy: [desc(productImages.isPrimary), asc(productImages.sortOrder)],
              },
              product: {
                with: {
                  category: true,
                  images: {
                    orderBy: [desc(productImages.isPrimary), asc(productImages.sortOrder)],
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cartRecord) {
    return buildEmptyCart(context);
  }

  const items: CartItemView[] = cartRecord.items.map((item) => {
    const variant = item.productVariant;
    const product = variant.product;
    const variantImage =
      variant.images.find((image) => image.isPrimary)?.url ??
      variant.images[0]?.url ??
      product.images.find((image) => image.isPrimary)?.url ??
      product.images[0]?.url ??
      defaultImage;
    const unitPrice = toCurrencyNumber(variant.salePrice ?? variant.price);
    const compareAtPrice =
      variant.salePrice === null ? null : toCurrencyNumber(variant.price);

    return {
      id: item.id,
      productId: product.id,
      productName: product.name,
      productDescription: product.description,
      category: product.category.name,
      variantId: variant.id,
      sku: variant.sku,
      color: variant.color.name,
      size: variant.size.name,
      image: variantImage,
      quantity: item.quantity,
      unitPrice,
      compareAtPrice,
      lineTotal: unitPrice * item.quantity,
      maxQuantity: Math.max(variant.inStock, 0),
    };
  });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: cartRecord.id,
    items,
    itemCount,
    subtotal,
    total: subtotal,
    isAuthenticated: context.isAuthenticated,
    guestSessionToken: context.guestSessionToken,
  };
}

async function assertVariantAvailable(productVariantId: string) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, productVariantId),
    with: {
      product: {
        columns: {
          id: true,
          isPublished: true,
        },
      },
    },
  });

  if (!variant || !variant.product.isPublished) {
    return {
      variant: null,
      error: "This product variant is unavailable.",
    };
  }

  if (variant.inStock <= 0) {
    return {
      variant: null,
      error: "This product variant is out of stock.",
    };
  }

  return {
    variant,
    error: null,
  };
}

async function getOwnedCartItem(cartItemId: string, context: CartOwnerContext) {
  const ownerCart = await findCartForOwner(context);

  if (!ownerCart) {
    return null;
  }

  return db.query.cartItems.findFirst({
    where: and(eq(cartItems.id, cartItemId), eq(cartItems.cartId, ownerCart.id)),
    columns: {
      id: true,
      cartId: true,
      productVariantId: true,
      quantity: true,
    },
  });
}

function normalizeQuantity(quantity: number | undefined, fallback = 1) {
  if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
    return fallback;
  }

  return Math.max(1, Math.floor(quantity));
}

function revalidateCartSurfaces() {
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function mergeGuestCartWithUserCart(
  userId: string,
  guestSessionToken: string,
): Promise<CartActionResult> {
  const [guestRecord] = await db
    .select()
    .from(guest)
    .where(eq(guest.sessionToken, guestSessionToken))
    .limit(1);

  const context: CartOwnerContext = {
    userId,
    guestId: null,
    guestSessionToken: null,
    isAuthenticated: true,
  };

  if (!guestRecord) {
    const userCart = await findCartForOwner(context);
    return {
      success: true,
      message: "No guest cart found to merge.",
      cart: await buildCartView(userCart?.id ?? null, context),
    };
  }

  const guestCart = await db.query.carts.findFirst({
    where: eq(carts.guestId, guestRecord.id),
    with: {
      items: true,
    },
  });

  const userCart =
    (await ensureCartForOwner(context)) ??
    (await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      columns: { id: true, userId: true, guestId: true },
    }));

  if (!userCart) {
    return {
      success: false,
      message: "Unable to prepare a user cart.",
      cart: buildEmptyCart(context),
      error: "User cart could not be created.",
    };
  }

  if (guestCart) {
    const existingUserItems = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, userCart.id),
    });

    const existingByVariant = new Map(
      existingUserItems.map((item) => [item.productVariantId, item]),
    );

    for (const guestItem of guestCart.items) {
      const existingItem = existingByVariant.get(guestItem.productVariantId);

      if (existingItem) {
        await db
          .update(cartItems)
          .set({
            quantity: existingItem.quantity + guestItem.quantity,
          })
          .where(eq(cartItems.id, existingItem.id));
      } else {
        await db.insert(cartItems).values({
          cartId: userCart.id,
          productVariantId: guestItem.productVariantId,
          quantity: guestItem.quantity,
        });
      }
    }

    await db.delete(carts).where(eq(carts.id, guestCart.id));
  }

  await db.delete(guest).where(eq(guest.id, guestRecord.id));
  revalidateCartSurfaces();

  return {
    success: true,
    message: "Guest cart merged successfully.",
    cart: await buildCartView(userCart.id, context),
  };
}

export async function getCart(): Promise<CartView> {
  const context = await resolveCartOwnerContext(false);
  const ownerCart = await findCartForOwner(context);
  return buildCartView(ownerCart?.id ?? null, context);
}

export async function addCartItem(
  input: AddCartItemInput,
): Promise<CartActionResult> {
  const context = await resolveCartOwnerContext(true);
  const ownerCart = await ensureCartForOwner(context);

  if (!ownerCart) {
    return {
      success: false,
      message: "Unable to initialize a cart.",
      cart: buildEmptyCart(context),
      error: "Cart initialization failed.",
    };
  }

  const desiredQuantity = normalizeQuantity(input.quantity, 1);
  const variantCheck = await assertVariantAvailable(input.productVariantId);

  if (!variantCheck.variant) {
    return {
      success: false,
      message: variantCheck.error ?? "This variant is unavailable.",
      cart: await buildCartView(ownerCart.id, context),
      error: variantCheck.error ?? "Variant unavailable.",
    };
  }

  const existingItem = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, ownerCart.id),
      eq(cartItems.productVariantId, input.productVariantId),
    ),
  });

  const nextQuantity = Math.min(
    variantCheck.variant.inStock,
    (existingItem?.quantity ?? 0) + desiredQuantity,
  );

  if (existingItem) {
    await db
      .update(cartItems)
      .set({ quantity: nextQuantity })
      .where(eq(cartItems.id, existingItem.id));
  } else {
    await db.insert(cartItems).values({
      cartId: ownerCart.id,
      productVariantId: input.productVariantId,
      quantity: nextQuantity,
    });
  }

  revalidateCartSurfaces();

  return {
    success: true,
    message: "Item added to cart.",
    cart: await buildCartView(ownerCart.id, context),
  };
}

export async function updateCartItem(
  input: UpdateCartItemInput,
): Promise<CartActionResult> {
  const context = await resolveCartOwnerContext(false);
  const ownedItem = await getOwnedCartItem(input.cartItemId, context);

  if (!ownedItem) {
    return {
      success: false,
      message: "Cart item not found.",
      cart: await getCart(),
      error: "Missing cart item.",
    };
  }

  const ownerCart = await findCartForOwner(context);
  if (!ownerCart) {
    return {
      success: false,
      message: "Cart not found.",
      cart: buildEmptyCart(context),
      error: "Missing cart.",
    };
  }

  if (input.quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, ownedItem.id));

    revalidateCartSurfaces();
    return {
      success: true,
      message: "Item removed from cart.",
      cart: await buildCartView(ownerCart.id, context),
    };
  }

  const targetVariantId = input.productVariantId ?? ownedItem.productVariantId;
  const variantCheck = await assertVariantAvailable(targetVariantId);

  if (!variantCheck.variant) {
    return {
      success: false,
      message: variantCheck.error ?? "This variant is unavailable.",
      cart: await buildCartView(ownerCart.id, context),
      error: variantCheck.error ?? "Variant unavailable.",
    };
  }

  const nextQuantity = Math.min(
    normalizeQuantity(input.quantity, ownedItem.quantity),
    variantCheck.variant.inStock,
  );

  if (targetVariantId !== ownedItem.productVariantId) {
    const duplicateItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, ownerCart.id),
        eq(cartItems.productVariantId, targetVariantId),
      ),
    });

    if (duplicateItem) {
      await db
        .update(cartItems)
        .set({
          quantity: Math.min(
            duplicateItem.quantity + nextQuantity,
            variantCheck.variant.inStock,
          ),
        })
        .where(eq(cartItems.id, duplicateItem.id));

      await db.delete(cartItems).where(eq(cartItems.id, ownedItem.id));
    } else {
      await db
        .update(cartItems)
        .set({
          productVariantId: targetVariantId,
          quantity: nextQuantity,
        })
        .where(eq(cartItems.id, ownedItem.id));
    }
  } else {
    await db
      .update(cartItems)
      .set({ quantity: nextQuantity })
      .where(eq(cartItems.id, ownedItem.id));
  }

  revalidateCartSurfaces();

  return {
    success: true,
    message: "Cart updated.",
    cart: await buildCartView(ownerCart.id, context),
  };
}

export async function removeCartItem(
  cartItemId: string,
): Promise<CartActionResult> {
  const context = await resolveCartOwnerContext(false);
  const ownedItem = await getOwnedCartItem(cartItemId, context);
  const ownerCart = await findCartForOwner(context);

  if (!ownedItem || !ownerCart) {
    return {
      success: false,
      message: "Cart item not found.",
      cart: buildEmptyCart(context),
      error: "Missing cart item.",
    };
  }

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  revalidateCartSurfaces();

  return {
    success: true,
    message: "Item removed from cart.",
    cart: await buildCartView(ownerCart.id, context),
  };
}

export async function clearCart(): Promise<CartActionResult> {
  const context = await resolveCartOwnerContext(false);
  const ownerCart = await findCartForOwner(context);

  if (!ownerCart) {
    return {
      success: true,
      message: "Cart is already empty.",
      cart: buildEmptyCart(context),
    };
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, ownerCart.id));
  revalidateCartSurfaces();

  return {
    success: true,
    message: "Cart cleared.",
    cart: await buildCartView(ownerCart.id, context),
  };
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

/**
 * Guard that protects routes by validating JWT Bearer tokens.
 * Implements NestJS's CanActivate interface to intercept incoming requests
 * before they reach the route handler.
 *
 * Usage: Apply via @UseGuards(JwtAuthGuard) on a controller or route handler.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    /**
     * Determines whether the current request is allowed to proceed.
     * Extracts and verifies the JWT from the Authorization header,
     * then attaches the decoded payload to the request object.
     *
     * @param context - Provides access to the current execution context (HTTP, WS, RPC, etc.)
     * @returns true if the token is valid, allowing the request to continue
     * @throws UnauthorizedException if the header is missing, malformed, or the token is invalid/expired
     */
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const auth = request.headers.authorization;

        // Reject requests that are missing the Authorization header or not using the Bearer scheme
        if (!auth || !auth.startsWith('Bearer')) {
            throw new UnauthorizedException();
        }

        // Extract the token portion from "Bearer <token>"
        const token = auth.split(' ')[1];

        try {
            // Verify the token's signature and expiry, returning the decoded payload
            const payload = this.jwtService.verify(token);

            // Attach the decoded payload (e.g. { sub, email }) to the request
            // so downstream controllers can access it via @Req() or custom decorators
            request.user = payload;

            return true;
        } catch {
            // Token is invalid, expired, or tampered with
            throw new UnauthorizedException();
        }
    }
}
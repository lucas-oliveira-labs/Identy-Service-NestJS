

export default class PasswordResetToken {
    id: number;
    userId: number;
    tokenHash: string;
    expiresAt: Date;
    usedAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;

    constructor(props: {
        id: number;
        userId: number;
        tokenHash: string;
        expiresAt: Date;
        usedAt: Date | null;
        revokedAt: Date | null;
        createdAt: Date;
    }) {
        this.id = props.id;
        this.userId = props.userId;
        this.tokenHash = props.tokenHash;
        this.expiresAt = props.expiresAt;
        this.usedAt = props.usedAt;
        this.revokedAt = props.revokedAt;
        this.createdAt = props.createdAt;
    }
}
interface userCredentialProps {
    id?: number;
    userId: number;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class UserCredential {
    id?: number;
    userId: number;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(props: userCredentialProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.password = props.password;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}

// isso correponde aos campos ja existentes de prisma
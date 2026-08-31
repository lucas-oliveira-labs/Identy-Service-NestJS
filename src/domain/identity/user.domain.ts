interface UserProps {
    id?: number;
    email: string;
    name: string;
    password: string;
    status :   string;
    createdAt: Date;
    updatedAt: Date;
}

export default class User {
    id?: number;
    email: string;
    name: string;
    password: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;



    constructor(props: UserProps) {
        this.id = props.id;
        this.email = props.email;
        this.name = props.name;
        this.password = props.password;
        this.status = props.status;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}



//pasta src/domain e dentro dela o arquivo User.ts, ela será a representação de livro que dependeremos em nosso código
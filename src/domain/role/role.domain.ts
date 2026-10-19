


export interface RoleProps {
    id?: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}


export default class Role {
    id?: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;


    constructor(props: RoleProps) {
        this.id = props.id;
        this.name = props.name;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}
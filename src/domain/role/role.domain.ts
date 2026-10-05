


export interface RoleProps {
    id?: number;
    name: string;
    createAt: Date;
    updateAt: Date;
}


export default class Role {
    id?: number;
    name: string;
    createAt: Date;
    updateAt: Date;


    constructor(props: RoleProps) {
        this.id = props.id;
        this.name = props.name;
        this.createAt = props.createAt;
        this.updateAt = props.updateAt;
    }
}
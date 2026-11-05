import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class de(){
    @PrimaryColumn("int")
    id = int
    @Column("text")
    content = string
}

@Entity()
export class en(){
    @PrimaryColumn("int")
    id = int
    @Column("text")
    content = string
}

import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class de {
    @PrimaryColumn("int")
    id!: number
    @Column("text")
    content!: string
}

@Entity()
export class en {
    @PrimaryColumn("int")
    id!: number
    @Column("text")
    content!: string
}

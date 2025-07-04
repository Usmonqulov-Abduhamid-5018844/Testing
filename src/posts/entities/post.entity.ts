import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar"})
    name: string

    @Column({type: "varchar"})
    posts: string
}

package com.gradlohbackend.orbital.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "Folders")
@Table(name = "Folders")
@IdClass(FolderId.class)
@Data
public class Folder {

    @Id
    @Column(name = "email")
    private String email;

    @Id
    @Column(name = "folder_name", nullable = false)
    private Byte folderName;

    @Id
    @Column(name = "module_code", length = 8, nullable = false)
    private String moduleCode;


}

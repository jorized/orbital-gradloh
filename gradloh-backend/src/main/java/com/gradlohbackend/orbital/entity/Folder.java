package com.gradlohbackend.orbital.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "Folders")
@Table(name = "Folders")
@IdClass(FolderId.class)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
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

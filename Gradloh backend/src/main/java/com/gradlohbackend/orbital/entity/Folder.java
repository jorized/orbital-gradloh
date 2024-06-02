package com.gradlohbackend.orbital.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Folders")
@Data
public class Folder {

    @Id
    @Column(name = "email", length = 8, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "folder_name", nullable = false)
    private FolderName folderName;

    @Column(name = "module_code", length = 7, nullable = false)
    private String moduleCode;

    @Column(name = "completion_status", nullable = false)
    private Boolean completionStatus;

    public enum FolderName {
        Y1S1, Y1S2, Y2S1, Y2S2, Y3S1, Y3S2, Y4S1, Y4S2
    }

}

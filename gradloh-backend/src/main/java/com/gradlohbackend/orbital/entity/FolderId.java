package com.gradlohbackend.orbital.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FolderId implements Serializable {

    private String email;
    private Byte folderName;
    private String moduleCode;

    @Override
    public int hashCode() {
        return Objects.hash(email, folderName, moduleCode);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        FolderId that = (FolderId) obj;
        return Objects.equals(email, that.email) &&
                Objects.equals(folderName, that.folderName) &&
                Objects.equals(moduleCode, that.moduleCode);
    }
}

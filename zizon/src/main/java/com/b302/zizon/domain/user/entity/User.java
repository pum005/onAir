    package com.b302.zizon.domain.user.entity;

    import lombok.Builder;
    import lombok.Getter;
    import lombok.ToString;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;

    import javax.persistence.*;
    import java.time.LocalDateTime;

    @Entity
    @Getter
    @ToString
    @EntityListeners(AuditingEntityListener.class)
    @Builder
    public class User {

        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long userNo;
        @Column(nullable = false)
        private String accountType;
        @Column(nullable = false, unique = true)
        private String email;
        @Column(nullable = false)
        private String userPw;
        private String nickname;
        private String profileImage;
        @CreatedDate
        @Column(nullable = false)
        private LocalDateTime registDate;

        public User() {
        }

        public User(Long userNo, String accountType, String email, String userPw, String nickname, String profileImage, LocalDateTime registDate) {
            this.userNo = userNo;
            this.accountType = accountType;
            this.email = email;
            this.userPw = userPw;
            this.nickname = nickname;
            this.profileImage = profileImage;
            this.registDate = registDate;
        }

        public void updatePassword(String userPw) {
            this.userPw = userPw;
        }

        public void updateNickname(String newNickname) {
            this.nickname = newNickname;
        }


        public void updateprofileImage(String profileImage){
            this.profileImage = profileImage;
        }


        public UserDTO toUserDTO(){
            return UserDTO.builder()
                    .userNo(this.userNo)
                    .accountType(this.accountType)
                    .email(this.email)
                    .nickname(this.nickname)
                    .profileImage(this.profileImage)
                    .build();
        }


    }

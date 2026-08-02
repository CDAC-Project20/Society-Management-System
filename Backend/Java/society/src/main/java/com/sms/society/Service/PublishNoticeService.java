package com.sms.society.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sms.society.DTO.NoticeDTO;
import com.sms.society.Entities.Notice;
import com.sms.society.Entities.Society;
import com.sms.society.Entities.User;
import com.sms.society.Repository.NoticeRepository;
import com.sms.society.Repository.SocietyRepository;
import com.sms.society.Repository.UserRepository;

@Service
public class PublishNoticeService {

    @Autowired
    private NoticeRepository noticeRepo;

    @Autowired
    private SocietyRepository societyRepo;

    @Autowired
    private UserRepository userRepo;

    public NoticeDTO.ResNotice publishNotice(NoticeDTO.ReqNotice reqNotice) throws Exception {
        if (reqNotice.getUserId() == null) {
            throw new Exception("User ID is required to publish a notice");
        }

        User user = userRepo.findById(reqNotice.getUserId())
            .orElseThrow(() -> new Exception("User not found"));

        String roleName = user.getRole().getRoleName();
        if (!"Admin".equalsIgnoreCase(roleName) && !"Secretary".equalsIgnoreCase(roleName)) {
            throw new Exception("Only Secretary or Admin can publish notices");
        }

        Society society = societyRepo.findById(reqNotice.getSocietyId())
            .orElseThrow(() -> new Exception("Society not found"));

        Notice notice = new Notice();
        notice.setSociety(society);
        notice.setPublishedBy(user);
        notice.setTitle(reqNotice.getTitle());
        notice.setDescription(reqNotice.getDescription());
        notice.setPublishedDate(reqNotice.getPublishedDate());
        notice.setExpiryDate(reqNotice.getExpiryDate());

        Notice savedNotice = noticeRepo.save(notice);

        return new NoticeDTO.ResNotice(
            savedNotice.getId(),
            society.getId(),
            savedNotice.getTitle(),
            savedNotice.getDescription(),
            savedNotice.getPublishedDate(),
            savedNotice.getExpiryDate()
        );
    }
}

package com.sms.society.Service;

import com.sms.society.DTO.NoticeDTO;
import com.sms.society.Entities.Notice;
import com.sms.society.Entities.Society;
import com.sms.society.Entities.User;
import com.sms.society.Repository.NoticeRepository;
import com.sms.society.Repository.SocietyRepository;
import com.sms.society.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SocietyRepository societyRepository;

    public List<NoticeDTO.Response> getNoticesBySociety(Long societyId) {
        List<Notice> notices = noticeRepository.findBySocietyIdOrderByIdDesc(societyId);
        return notices.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public NoticeDTO.Response createNotice(NoticeDTO.Request request) throws Exception {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new Exception("Notice title is required.");
        }

        User publisher = userRepository.findById(request.getPublishedById())
                .orElseThrow(() -> new Exception("Publisher user not found with ID: " + request.getPublishedById()));

        Society society = publisher.getSociety();
        if (society == null && request.getSocietyId() != null) {
            society = societyRepository.findById(request.getSocietyId()).orElse(null);
        }

        if (society == null) {
            throw new Exception("Society not found for the user.");
        }

        Notice notice = new Notice();
        notice.setSociety(society);
        notice.setTitle(request.getTitle());
        notice.setDescription(request.getDescription());
        notice.setPublishedBy(publisher);
        notice.setPublishDate(new Timestamp(System.currentTimeMillis()));

        if (request.getExpiryDateStr() != null && !request.getExpiryDateStr().trim().isEmpty()) {
            try {
                String dateStr = request.getExpiryDateStr().trim();
                if (dateStr.length() == 10) {
                    dateStr += " 23:59:59";
                }
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date parsedDate = sdf.parse(dateStr);
                notice.setExpiryDate(new Timestamp(parsedDate.getTime()));
            } catch (Exception e) {
                // If parsing fails, store null or log exception
                notice.setExpiryDate(null);
            }
        }

        Notice saved = noticeRepository.save(notice);
        return mapToResponse(saved);
    }

    public void deleteNotice(Long noticeId) throws Exception {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new Exception("Notice not found with ID: " + noticeId));
        noticeRepository.delete(notice);
    }

    private NoticeDTO.Response mapToResponse(Notice n) {
        NoticeDTO.Response resp = new NoticeDTO.Response();
        resp.setId(n.getId());
        if (n.getSociety() != null) {
            resp.setSocietyId(n.getSociety().getId());
            resp.setSocietyName(n.getSociety().getSocietyName());
        }
        resp.setTitle(n.getTitle());
        resp.setDescription(n.getDescription());
        if (n.getPublishedBy() != null) {
            resp.setPublishedById(n.getPublishedBy().getId());
            String publisherName = n.getPublishedBy().getFirstName() +
                    (n.getPublishedBy().getLastName() != null ? " " + n.getPublishedBy().getLastName() : "");
            resp.setPublishedByName(publisherName);
        }
        resp.setPublishDate(n.getPublishDate());
        resp.setExpiryDate(n.getExpiryDate());

        boolean isExpired = false;
        if (n.getExpiryDate() != null) {
            isExpired = n.getExpiryDate().before(new Date());
        }
        resp.setExpired(isExpired);

        return resp;
    }
}

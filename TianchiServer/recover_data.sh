#!/bin/bash
cd /root/Tianchi-Analysis/Arsenal-DataAnalysis/TianchiServer &&
git checkout master &&
git pull origin master &&
python manage.py migrate &&
python manage.py runscript recover_kaoqin_type_and_event &&
python manage.py runscript recover_exam_type &&
python manage.py runscript recover_teacher_and_record &&
python manage.py runscript recover_student_info &&
python -W ignore manage.py runscript recover_kaoqin_record &&
python -W ignore manage.py runscript recover_consumptions &&
python -W ignore manage.py runscript recover_student_exam &&
python manage.py runscript generate_course_chosen_record &&
python manage.py runscript calculate_score &&
python manage.py runscript refine_student_record_term &&
python manage.py runscript generate_ciyun_tag &&
python manage.py runscript refine_student_native_place &&
python manage.py runscript generate_course_tags &&

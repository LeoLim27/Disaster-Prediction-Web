package com.kcu.disaster.service;

import com.kcu.disaster.Entity.Disaster;
import com.kcu.disaster.repository.DisasterRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

@Service
public class CsvParserService {

  @Autowired
  private DisasterRepository disasterRepository;


  public void importCsvData(String filePath) throws IOException, CsvValidationException {
    try (Reader reader = new FileReader(filePath);
        CSVReader csvReader = new CSVReader(reader)) {

      String[] nextRecord;
      csvReader.readNext(); // 첫 줄(헤더) 건너뛰기

      while ((nextRecord = csvReader.readNext()) != null) {
        Disaster disaster = new Disaster();
        disaster.setFemaDeclarationString(nextRecord[1]);
        disaster.setDisasterNumber(nextRecord[2]);
        disaster.setState(nextRecord[3]);
        disaster.setDeclarationType(nextRecord[4]);
        disaster.setDeclarationDate(nextRecord[5]);
        disaster.setFyDeclared(nextRecord[6]);
        disaster.setDeclarationTitle(nextRecord[7]);
        disaster.setIhProgramDeclared(nextRecord[8]);
        disaster.setIaProgramDeclared(nextRecord[9]);
        disaster.setPaProgramDeclared(nextRecord[10]);
        disaster.setHmProgramDeclared(nextRecord[11]);
        disaster.setIncidentBeginDate(nextRecord[12]);
        disaster.setIncidentEndDate(nextRecord[13]);
        disaster.setDisasterCloseoutDate(nextRecord[14]);
        disaster.setTribalRequest(nextRecord[15]);
        disaster.setFipsStateCode(nextRecord[16]);
        disaster.setFipsCountyCode(nextRecord[17]);
        disaster.setPlaceCode(nextRecord[18]);
        disaster.setDesignatedArea(nextRecord[19]);
        disaster.setDeclarationRequestNumber(nextRecord[20]);
        disaster.setLastIAFilingDate(nextRecord[21]);
        disaster.setIncidentId(nextRecord[22]);
        disaster.setRegion(nextRecord[23]);
        disaster.setDesignatedIncidentTypes(nextRecord[24]);
        disaster.setLastRefresh(nextRecord[25]);

        disasterRepository.save(disaster);
      }
    }
  }
}

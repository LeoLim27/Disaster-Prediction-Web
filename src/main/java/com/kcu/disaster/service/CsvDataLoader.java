package com.kcu.disaster.service;

import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CsvDataLoader implements CommandLineRunner {

  @Autowired
  private CsvParserService csvParserService;

  private static final String CSV_FILE_PATH = "src/main/resources/disaster_data.csv"; // CSV 파일 경로

  @Override
  public void run(String... args) throws Exception {
    try {
      csvParserService.importCsvData(CSV_FILE_PATH);
      System.out.println("csv file is loaded successfully");
    } catch (IOException | CsvValidationException e) {
      System.err.println("some error occured in loading csv file: " + e.getMessage());
    }
  }
}

/**
 * Main controller.
 */
package info.san.dmc.controllers;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import info.san.dmc.model.Skein;
import info.san.dmc.model.SkeinState;

/**
 * MIT License
 *
 * Copyright (c) 2016 sangellozn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * @author ANGELLOZ-NICOUD Sébastien
 */
@RestController
@RequestMapping("/api")
public class MainController {

    /**
     * Main mapping.
     *
     * @return the content.
     */
    @RequestMapping("/data")
    public List<Skein> main() {
        return this.loadData();
    }

    private List<Skein> loadData() {
        try {
            File dataFile = this.getFile();

            ObjectMapper objectMapper = new ObjectMapper();
            String dataJson = FileUtils.readFileToString(dataFile, StandardCharsets.UTF_8);
            List<Skein> result = objectMapper.readValue(dataJson, new TypeReference<List<Skein>>(){});
            Collections.sort(result, (left, right) -> {
                String leftCode = left.getCode();
                String rightCode = right.getCode();
                if (NumberUtils.isCreatable(leftCode) && NumberUtils.isCreatable(rightCode)) {
                    return Long.valueOf(leftCode).compareTo(Long.valueOf(rightCode));
                }

                return left.getCode().compareToIgnoreCase(right.getCode());
            });

            return result;
        } catch (NamingException | IOException e) {
           throw new IllegalArgumentException(e);
        }
    }

    private File getFile() throws NamingException {
        InitialContext context = new InitialContext();
        Context xmlNode = (Context) context.lookup("java:comp/env");
        String dataFilePath = (String) xmlNode.lookup("data-file");

        File dataFile = new File(dataFilePath);

        if (!dataFile.exists()) {
            throw new IllegalArgumentException("The file referenced by the data-file context param does not exists.");
        }
        return dataFile;
    }

    /**
     * Save the state of a threads.
     *
     * @param state the state of the threads.
     */
    @PostMapping("/data/state")
    public void saveState(@RequestBody SkeinState state) {
        List<Skein> data = this.loadData();

        try {
            Optional<Skein> threads = data.stream().filter(item -> item.getCode().equals(state.getCode())).findFirst();
            if (threads.isPresent()) {
                threads.get().setState(state.getState());
                File dataFile = this.getFile();
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(dataFile, data);
            }
        } catch (NamingException | IOException e) {
            throw new IllegalArgumentException(e);
        }
    }

    /**
     * Save the state of a threads.
     *
     * @param state the state of the threads.
     */
    @PostMapping("/data/nb")
    public void saveNb(@RequestBody SkeinState state) {
        List<Skein> data = this.loadData();

        try {
            Optional<Skein> threads = data.stream().filter(item -> item.getCode().equals(state.getCode())).findFirst();
            if (threads.isPresent()) {
                threads.get().setNb(state.getNb());
                File dataFile = this.getFile();
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.writeValue(dataFile, data);
            }
        } catch (NamingException | IOException e) {
            throw new IllegalArgumentException(e);
        }
    }

}

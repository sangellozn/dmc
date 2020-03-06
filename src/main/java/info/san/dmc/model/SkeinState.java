package info.san.dmc.model;

/**
 *
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
 * Threads state for save.
 *
 * @author ANGELLOZ-NICOUD Sébastien
 */
public class SkeinState {

    private String code;
    private info.san.dmc.SkeinState state;
    private Long nb;

    /**
     * @return the code
     */
    public String getCode() {
        return this.code;
    }

    /**
     * @param code
     *            the code to set
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * @return the state
     */
    public info.san.dmc.SkeinState getState() {
        return this.state;
    }

    /**
     * @param state
     *            the state to set
     */
    public void setState(info.san.dmc.SkeinState state) {
        this.state = state;
    }

    /**
     * @return the nbThreads
     */
    public Long getNb() {
        return this.nb;
    }

    /**
     * @param nb the nb to set
     */
    public void setNb(Long nb) {
        this.nb = nb;
    }

}